import { dag } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import { hdkey } from 'ethereumjs-wallet';
import {
  XChainEthClient,
  utils,
} from '@stardust-collective/dag4-xchain-ethereum';
import { Transaction, PendingTx } from '@stardust-collective/dag4-network';

import store from 'state/store';
import {
  createAccount,
  updateStatus,
  removeAccount,
  updateAccount,
  updateTransactions,
  updateLabel,
  removeKeystoreInfo,
  changeActiveAsset,
  addAsset,
} from 'state/wallet';
import IWalletState, {
  AccountType,
  AssetType,
  IAccountState,
  IAssetState,
  PrivKeystore,
} from 'state/wallet/types';

import { IAccountInfo, ITransactionInfo, ETHNetwork } from '../../types';
import IAssetListState from 'state/assets/types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => Promise<void>;
  getPrivKey: (id: string, pwd: string) => Promise<string | null>;
  getPrimaryAccount: (pwd: string) => void;
  isValidDAGAddress: (address: string) => boolean;
  isValidERC20Address: (address: string) => boolean;
  subscribeAccount: (index: number) => Promise<string | null>;
  unsubscribeAccount: (index: number, pwd: string) => boolean;
  addNewAccount: (label: string) => Promise<string | null>;
  updateTxs: (limit?: number, searchAfter?: string) => Promise<void>;
  updateAccountLabel: (id: string, label: string) => void;
  updateAccountActiveAsset: (id: string, assetId: string) => void;
  addNewAsset: (id: string, assetId: string, address: string) => Promise<void>;
  importPrivKeyAccount: (
    privKey: string,
    label: string
  ) => Promise<string | null>;
  removePrivKeyAccount: (id: string, password: string) => boolean;
  getRecommendFee: () => Promise<number>;
  getRecommendETHTxConfig: () => Promise<{
    nonce: number;
    gas: number;
    gasLimit: number;
    txData: string;
  }>;
  updateETHTxConfig: ({
    nonce,
    gas,
    gasLimit,
    txData,
  }: {
    gas?: number;
    gasLimit?: number;
    nonce?: number;
    txData?: string;
  }) => void;
  getLatestGasPrices: () => Promise<number[]>;
  estimateGasFee: () => Promise<number | null>;
  watchMemPool: () => void;
  getLatestUpdate: () => Promise<void>;
}

const AccountController = (actions: {
  getMasterKey: () => hdkey | null;
  checkPassword: (pwd: string) => boolean;
  importPrivKey: (privKey: string) => Promise<PrivKeystore | null>;
}): IAccountController => {
  let privateKey: string;
  let tempTx: ITransactionInfo | null;
  let account: IAccountState | null;
  let intervalId: any;
  let password: string;
  let ethClient: XChainEthClient;

  // limit number of txs
  const TXS_LIMIT = 10;

  /**
   * Convert pending DAG Tx type to standard Tx type
   *
   * @param pending {PendingTx}
   * @returns {Transaction}
   */
  const _coventDAGPendingTx = (pending: PendingTx) => {
    return {
      hash: pending.hash,
      amount: pending.amount,
      receiver: pending.receiver,
      sender: pending.sender,
      fee: -1,
      isDummy: true,
      timestamp: new Date(pending.timestamp).toISOString(),
      lastTransactionRef: {},
      snapshotHash: '',
      checkpointBlock: '',
    } as Transaction;
  };

  const _fetchSingleERC20Asset = async (asset: IAssetState) => {
    const ethAddress = ethClient.getAddress();
    const assetList: IAssetListState = store.getState().assets;
    const { activeNetwork }: IWalletState = store.getState().wallet;
    const isTestnet = activeNetwork[AssetType.Ethereum] === 'testnet';
    let address = assetList[asset.id].address;

    ethClient.setNetwork(activeNetwork[AssetType.Ethereum] as ETHNetwork);
    if (isTestnet && address) {
      address = address.substring(2);
    }
    const balances = await ethClient.getKnownTokenBalances(ethAddress, [
      {
        address: address || '',
        symbol: assetList[asset.id].symbol,
        decimals: assetList[asset.id].decimals || 18,
      },
    ]);
    const transactions = await ethClient.getTransactions({
      address: ethAddress,
      limit: TXS_LIMIT,
      asset: address,
    });

    return {
      id: asset.id,
      balance: balances[0].balance || 0,
      address: ethAddress,
      transactions: transactions.txs.map((tx) => {
        return {
          ...tx,
          balance: ethers.utils.formatUnits(
            tx.from[0].amount.amount().toString(),
            assetList[asset.id].decimals || 18
          ),
        };
      }),
    };
  };

  const _fetchERC20Assets = async () => {
    if (!ethClient) return {};
    const { accounts, activeAccountId }: IWalletState = store.getState().wallet;
    const LATTICE_ASSET = '0xa393473d64d2F9F026B60b6Df7859A689715d092';
    const assets = accounts[activeAccountId]?.assets || {};
    const erc20Assets: {
      [assetId: string]: IAssetState;
    } = Object.values(assets)
      .filter(
        (asset) =>
          asset.id !== AssetType.Ethereum &&
          asset.id !== AssetType.Constellation
      )
      .reduce(
        (assets, asset) => {
          return {
            ...assets,
            [asset.id]: asset,
          };
        },
        {
          [LATTICE_ASSET]: {
            id: LATTICE_ASSET,
            balance: 0,
            address: '',
            transactions: [],
          },
        }
      );

    for (let i = 0; i < Object.values(erc20Assets).length; i++) {
      erc20Assets[
        Object.values(erc20Assets)[i].id
      ] = await _fetchSingleERC20Asset(Object.values(erc20Assets)[i]);
    }
    return erc20Assets;
  };

  /**
   * Get latest update info of a account by private key
   *
   * @param privateKey {string}
   * @returns {IAccountInfo}
   */
  const getAccountByPrivateKey = async (
    privateKey: string
  ): Promise<IAccountInfo> => {
    const { activeNetwork }: IWalletState = store.getState().wallet;
    dag.account.loginPrivateKey(privateKey);
    ethClient = new XChainEthClient({
      network: activeNetwork[AssetType.Ethereum] as ETHNetwork,
      privateKey,
      etherscanApiKey: process.env.ETHERSCAN_API_KEY,
      infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
    });

    // fetch dag info
    const dagBalance = await dag.account.getBalance();
    const dagTxs = await dag.account.getTransactions(TXS_LIMIT);

    // fetch eth info
    const ethAddress = ethClient.getAddress();
    const balances = await ethClient.getBalance();
    const ethBalance = ethers.utils.formatEther(
      balances[0].amount.amount().toString()
    );
    const ethTxs = await ethClient.getTransactions({
      address: ethAddress,
      limit: TXS_LIMIT,
    });

    // fetch other erc20 assets info
    const erc20Assets = await _fetchERC20Assets();

    return {
      assets: {
        [AssetType.Constellation]: {
          id: AssetType.Constellation,
          balance: dagBalance,
          address: dag.account.address,
          transactions: dagTxs,
        },
        [AssetType.Ethereum]: {
          id: AssetType.Ethereum,
          balance: Number(ethBalance),
          address: ethAddress,
          transactions: ethTxs.txs.map((tx) => {
            return {
              ...tx,
              balance: ethers.utils.formatEther(
                tx.from[0].amount.amount().toString()
              ),
            };
          }),
        },
        ...erc20Assets,
      },
    };
  };

  /**
   * Get latest update info of a account by account index
   *
   * @param index {number} account index of seed-phrase wallet
   * @returns {AccountInfo | null}
   */
  const getAccountByIndex = async (index: number) => {
    const masterKey: hdkey | null = actions.getMasterKey();
    if (!masterKey) return null;
    privateKey = dag.keyStore.deriveAccountFromMaster(masterKey, index);
    return await getAccountByPrivateKey(privateKey);
  };

  /**
   * Get latest update info of a account
   * by `id` of the keystore generated with a private key
   *
   * @param keystoreId {string} keystore id of imported keystores
   * @returns {AccountInfo | null}
   */
  const getAccountByPrivKeystore = async (keystoreId: string) => {
    const { keystores }: IWalletState = store.getState().wallet;
    if (!password || !keystores[keystoreId]) return null;
    privateKey = await dag.keyStore.decryptPrivateKey(
      keystores[keystoreId] as PrivKeystore,
      password
    );
    return await getAccountByPrivateKey(privateKey);
  };

  const subscribeAccount = async (index: number, label?: string) => {
    const { accounts }: IWalletState = store.getState().wallet;
    const seedAccounts = Object.values(accounts).filter(
      (account) => account.type === AccountType.Seed
    );

    if (seedAccounts && Object.keys(seedAccounts).includes(String(index)))
      return null;
    const accountInfo: IAccountInfo | null = await getAccountByIndex(index);

    if (!accountInfo) return null;
    account = {
      id: String(index),
      label: label || `Account ${index + 1}`,
      ...accountInfo,
      activeAssetId: AssetType.Constellation,
      type: AccountType.Seed,
    };

    store.dispatch(createAccount(account));
    return account.assets[AssetType.Constellation].address;
  };

  const removePrivKeyAccount = (id: string, pwd: string) => {
    if (!actions.checkPassword(pwd)) return false;
    store.dispatch(removeKeystoreInfo(id));
    store.dispatch(removeAccount(id));
    store.dispatch(updateStatus());
    return true;
  };

  const addNewAccount = async (label: string) => {
    const { accounts }: IWalletState = store.getState().wallet;
    const seedAccounts = Object.values(accounts).filter(
      (account) => account.type === AccountType.Seed
    );
    let idx = -1;
    Object.keys(seedAccounts).forEach((index, i) => {
      if (index !== String(i)) {
        idx = i;
        return;
      }
    });
    if (idx === -1) {
      idx = Object.keys(seedAccounts).length;
    }
    return await subscribeAccount(idx, label);
  };

  const unsubscribeAccount = (index: number, pwd: string) => {
    if (actions.checkPassword(pwd)) {
      store.dispatch(removeAccount(String(index)));
      store.dispatch(updateStatus());
      return true;
    }
    return false;
  };

  const importPrivKeyAccount = async (privKey: string, label: string) => {
    if (!label) return null;

    const keystore = await actions.importPrivKey(privKey);
    if (!keystore) return null;

    const { accounts }: IWalletState = store.getState().wallet;
    const accountInfo = await getAccountByPrivateKey(privKey);

    // check if the same account exists
    const isExisting =
      Object.values(accounts).filter(
        (acc) =>
          acc.assets[AssetType.Constellation].address ===
          accountInfo.assets[AssetType.Constellation].address
      ).length > 0;
    if (isExisting) {
      store.dispatch(removeKeystoreInfo(keystore.id));
      return null;
    }

    privateKey = privKey;
    account = {
      id: keystore.id,
      label: label,
      ...accountInfo,
      activeAssetId: AssetType.Constellation,
      type: AccountType.PrivKey,
    };

    store.dispatch(createAccount(account));
    return account.assets[AssetType.Constellation].address;
  };

  const getPrimaryAccount = (pwd: string) => {
    const { accounts, activeAccountId }: IWalletState = store.getState().wallet;
    if (!actions.checkPassword(pwd)) return;
    password = pwd;
    getLatestUpdate();
    if (!account && accounts && Object.keys(accounts).length) {
      account = accounts[activeAccountId];
      store.dispatch(updateStatus());
    }
  };

  const getLatestUpdate = async () => {
    const { activeAccountId, accounts }: IWalletState = store.getState().wallet;
    if (
      !accounts[activeAccountId] ||
      accounts[activeAccountId].type === undefined
    )
      return;

    const accLatestInfo =
      accounts[activeAccountId].type === AccountType.Seed
        ? await getAccountByIndex(Number(activeAccountId))
        : await getAccountByPrivKeystore(activeAccountId);

    if (!accLatestInfo) return;

    account = accounts[activeAccountId];

    // check pending DAG txs
    const memPool = window.localStorage.getItem('dag4-network-main-mempool');
    if (memPool) {
      const pendingTxs = JSON.parse(memPool);
      pendingTxs.forEach((pTx: PendingTx) => {
        if (
          !account ||
          (account.assets[AssetType.Constellation].address !== pTx.sender &&
            account.assets[AssetType.Constellation].address !== pTx.receiver) ||
          accLatestInfo.assets[AssetType.Constellation].transactions.filter(
            (tx: Transaction) => tx.hash === pTx.hash
          ).length > 0
        )
          return;
        accLatestInfo.assets[AssetType.Constellation].transactions.unshift(
          _coventDAGPendingTx(pTx)
        );
      });
    }

    store.dispatch(
      updateAccount({
        id: activeAccountId,
        ...accLatestInfo,
      })
    );
  };

  const getPrivKey = async (id: string, pwd: string) => {
    const { keystores, accounts }: IWalletState = store.getState().wallet;
    if (!account || !actions.checkPassword(pwd)) return null;
    if (accounts[id].type === AccountType.Seed) {
      const masterKey: hdkey | null = actions.getMasterKey();
      if (!masterKey) return null;
      return dag.keyStore.deriveAccountFromMaster(masterKey, Number(id));
    } else {
      const privkey = await dag.keyStore.decryptPrivateKey(
        keystores[id] as PrivKeystore,
        pwd
      );
      return privkey;
    }
  };

  const updateAccountLabel = (id: string, label: string) => {
    store.dispatch(updateLabel({ id, label }));
  };

  const updateAccountActiveAsset = (id: string, assetId: string) => {
    store.dispatch(changeActiveAsset({ id, assetId }));
    getLatestUpdate();
  };

  const addNewAsset = async (id: string, assetId: string, address: string) => {
    const asset = await _fetchSingleERC20Asset({
      id: assetId,
      balance: 0,
      address,
      transactions: [],
    });
    store.dispatch(addAsset({ id, asset }));
  };

  // Tx-Related
  const updateTempTx = (tx: ITransactionInfo) => {
    if (dag.account.isActive()) {
      tempTx = { ...tempTx, ...tx };
      tempTx.fromAddress = tempTx.fromAddress.trim();
      tempTx.toAddress = tempTx.toAddress.trim();
    }
  };

  const getTempTx = () => {
    return dag.account.isActive() ? tempTx : null;
  };

  const updateTxs = async (limit = 10, searchAfter?: string) => {
    if (!account) return;
    const newTxs = await dag.account.getTransactions(limit, searchAfter);
    store.dispatch(
      updateTransactions({
        id: account.id,
        assetId: AssetType.Constellation,
        txs: [
          ...account.assets[AssetType.Constellation].transactions,
          ...newTxs,
        ],
      })
    );
  };

  const watchMemPool = () => {
    if (intervalId) return;
    intervalId = setInterval(async () => {
      await getLatestUpdate();
      const {
        activeAccountId,
        accounts,
      }: IWalletState = store.getState().wallet;
      if (
        !accounts[activeAccountId] ||
        !accounts[activeAccountId].assets[AssetType.Constellation]
          .transactions ||
        !accounts[activeAccountId].assets[
          AssetType.Constellation
        ].transactions.filter((tx: Transaction) => tx.fee === -1).length
      ) {
        clearInterval(intervalId);
      }
    }, 30 * 1000);
  };

  const confirmTempTx = async () => {
    if (!dag.account.isActive) {
      throw new Error('Error: No signed account exists');
    }
    if (!account) {
      throw new Error("Error: Can't find active account info");
    }
    if (!tempTx) {
      throw new Error("Error: Can't find transaction info");
    }
    try {
      const {
        accounts,
        activeAccountId,
      }: IWalletState = store.getState().wallet;
      const assetId = accounts[activeAccountId].activeAssetId;

      if (assetId === AssetType.Constellation) {
        const pendingTx = await dag.account.transferDag(
          tempTx.toAddress,
          tempTx.amount,
          tempTx.fee
        );
        dag.monitor.addToMemPoolMonitor(pendingTx);
        store.dispatch(
          updateTransactions({
            id: account.id,
            assetId: AssetType.Constellation,
            txs: [
              _coventDAGPendingTx(pendingTx),
              ...account.assets[AssetType.Constellation].transactions,
            ],
          })
        );
        watchMemPool();
      } else {
        if (!tempTx.ethConfig) return;
        const { gas, gasLimit } = tempTx.ethConfig;
        const txOptions = {
          recipient: tempTx.toAddress,
          amount: utils.baseAmount(
            ethers.utils.parseEther(tempTx.amount.toString()).toString(),
            18
          ),
          gasPrice: gas
            ? utils.baseAmount(
                ethers.utils.parseUnits(gas.toString(), 'gwei').toString(),
                9
              )
            : undefined,
          gasLimit: gasLimit ? BigNumber.from(gasLimit) : undefined,
        };
        ethClient.transfer(txOptions);
      }
      tempTx = null;
    } catch (error) {
      throw new Error(error);
    }
  };

  // Other
  const isValidDAGAddress = (address: string) => {
    return dag.account.validateDagAddress(address);
  };

  const isValidERC20Address = (address: string) => {
    return ethClient.validateAddress(address);
  };

  const getRecommendFee = async () => {
    return await dag.account.getFeeRecommendation();
  };

  const getLatestGasPrices = async () => {
    const gasPrices = await ethClient.estimateGasPrices();
    return Object.values(gasPrices).map((gas) => {
      return Number(
        ethers.utils.formatUnits(gas.amount().toString(), 'gwei').toString()
      );
    });
  };

  const getRecommendETHTxConfig = async () => {
    const txHistory = await ethClient.getTransactions();
    const nonce = txHistory.txs.length;
    const gasPrices = await ethClient.estimateGasPrices();
    const gasLimit = 21000;

    const recommendConfig = {
      nonce,
      gas: Number(
        ethers.utils
          .formatUnits(gasPrices.average.amount().toString(), 'gwei')
          .toString()
      ),
      gasLimit,
      txData: '',
    };

    if (!tempTx) {
      tempTx = { fromAddress: '', toAddress: '', amount: 0 };
      tempTx.ethConfig = recommendConfig;
    }

    return recommendConfig;
  };

  const updateETHTxConfig = ({
    nonce,
    gas,
    gasLimit,
    txData,
  }: {
    gas?: number;
    gasLimit?: number;
    nonce?: number;
    txData?: string;
  }) => {
    if (!tempTx || !tempTx.ethConfig) return;
    tempTx.ethConfig = {
      ...tempTx.ethConfig,
      nonce: nonce || tempTx.ethConfig.nonce,
      gas: gas || tempTx.ethConfig.gas,
      gasLimit: gasLimit || tempTx.ethConfig.gasLimit,
      txData: txData || tempTx.ethConfig.txData,
    };
  };

  const estimateGasFee = async () => {
    if (!tempTx) return null;
    if (!tempTx.ethConfig) {
      tempTx.ethConfig = await getRecommendETHTxConfig();
    }
    const { gas, gasLimit } = tempTx.ethConfig;

    const fee = ethers.utils
      .parseUnits(gas.toString(), 9)
      .mul(BigNumber.from(gasLimit));

    return Number(ethers.utils.formatEther(fee).toString());
  };

  return {
    getTempTx,
    updateTempTx,
    confirmTempTx,
    getPrivKey,
    importPrivKeyAccount,
    getPrimaryAccount,
    isValidDAGAddress,
    isValidERC20Address,
    subscribeAccount,
    unsubscribeAccount,
    removePrivKeyAccount,
    addNewAccount,
    getLatestUpdate,
    watchMemPool,
    updateTxs,
    updateAccountLabel,
    updateAccountActiveAsset,
    addNewAsset,
    getRecommendFee,
    getRecommendETHTxConfig,
    updateETHTxConfig,
    getLatestGasPrices,
    estimateGasFee,
  };
};

export default AccountController;
