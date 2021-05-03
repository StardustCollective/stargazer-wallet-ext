import { dag4 } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import { utils, XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { PendingTx, Transaction } from '@stardust-collective/dag4-network';

import store from 'state/store';
import {
  // addAsset,
  changeActiveAsset,
  // createAccount,
  // removeAccount,
  // removeKeystoreInfo,
  // updateAccount,
  updateLabel,
  updateStatus,
  updateTransactions
} from 'state/vault';
import IVaultState, {
  AssetType,
  IActiveWalletState,
  IAssetState,
  IWalletState,
} from 'state/vault/types';

import { ETHNetwork, ITransactionInfo } from '../../types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import TransactionController, { ITransactionController } from './TransactionController';

import { IAccountController } from './IAccountController';
import { KeyringManager } from '@stardust-collective/dag4-keyring';

// limit number of txs
// const TXS_LIMIT = 10;

export class AccountController implements IAccountController {
  privateKey = '';
  intervalId: any;
  password = '';
  tempTx: ITransactionInfo | null;
  wallet: IActiveWalletState | null;
  ethClient: XChainEthClient;
  txController: ITransactionController;
  
  constructor(private keyringManager: Readonly<KeyringManager>) {
    this.txController = Object.freeze(
      TransactionController({ getLatestUpdate: () => this.getLatestUpdate() })
    );
  }

  /**
   * Convert pending DAG Tx type to standard Tx type
   *
   * @param pending {PendingTx}
   * @returns {Transaction}
   */
  private _coventDAGPendingTx (pending: PendingTx) {
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
  }

  // private async _fetchSingleERC20Asset (asset: IAssetInfoState): Promise<IActiveAssetState> {
  //   const ethAddress = this.ethClient.getAddress();
  //   // const assetList: IAssetListState = store.getState().assets;
  //   const { contract, decimals, symbol, network } = asset;
  //
  //   if (!contract || !decimals) return null;
  //   const balance = await this.ethClient.getTokenBalance(
  //     ethAddress,
  //     {
  //       address: contract,
  //       decimals,
  //       symbol,
  //     },
  //     network === 'mainnet' ? 1 : 3
  //   );
  //   const transactions = await this.ethClient.getTransactions({
  //     address: ethAddress,
  //     limit: TXS_LIMIT,
  //     asset: contract,
  //   });
  //
  //   return {
  //     id: asset.id,
  //     type: asset.type,
  //     balance,
  //     address: ethAddress,
  //     transactions: transactions.txs.map((tx) => {
  //       return {
  //         ...tx,
  //         balance: ethers.utils.formatUnits(
  //           tx.from[0].amount.amount().toString(),
  //           asset.decimals || 18
  //         ),
  //       };
  //     }),
  //   };
  // }
  //
  // private async _fetchERC20Assets (accountAddress?: string) {
  //   if (!this.ethClient) return {};
  //   //const { accounts, activeAccountId }: IVaultState = store.getState().vault;
  //   const assets = this.keyringMa
  //   const assets = accounts[accountId || activeAccountId]?.assets || {};
  //   const erc20Assets: {
  //     [assetId: string]: IAssetState;
  //   } = Object.values(assets)
  //     .filter(
  //       (asset) =>
  //         asset.type !== AssetType.Ethereum &&
  //         asset.type !== AssetType.Constellation
  //     )
  //     .reduce(
  //       (assets, asset) => {
  //         return {
  //           ...assets,
  //           [asset.type]: asset,
  //         };
  //       },
  //       {
  //         [LATTICE_ASSET]: {
  //           type: AssetType.Ethereum,
  //           contract: LATTICE_ASSET,
  //           balance: 0,
  //           address: '',
  //           transactions: [],
  //         },
  //       }
  //     );
  //
  //   for (let i = 0; i < Object.values(erc20Assets).length; i++) {
  //     const asset = await this._fetchSingleERC20Asset(Object.values(erc20Assets)[i]);
  //     if (asset) {
  //       erc20Assets[Object.values(erc20Assets)[i].type] = asset;
  //     }
  //   }
  //   return erc20Assets;
  // }

  /**
   * Get latest update info of a wallet by private key
   *
   * @param privateKey {string}
   * @returns {IAccountInfo}
   */
  // async getAccountByPrivateKey ( privateKey: string, chainId: KeyringChainId, accountAddress?: string ): Promise<IAccountInfo> {
  //   const { activeNetwork }: IVaultState = store.getState().vault;
  //   let assets: any = {};
  //
  //   if (
  //     chainId === KeyringChainId.Constellation
  //   ) {
  //     dag4.account.loginPrivateKey(privateKey);
  //
  //     // fetch dag info
  //     const dagBalance = await dag4.account.getBalance();
  //     const dagTxs = await dag4.account.getTransactions(TXS_LIMIT);
  //
  //     assets[AssetType.Constellation] = {
  //       id: AssetType.Constellation,
  //       balance: dagBalance,
  //       address: dag4.account.address,
  //       transactions: dagTxs,
  //     };
  //   }
  //
  //   if (
  //     chainId === KeyringChainId.Ethereum
  //   ) {
  //     this.ethClient = new XChainEthClient({
  //       network: activeNetwork[AssetType.Ethereum] as ETHNetwork,
  //       privateKey,
  //       etherscanApiKey: process.env.ETHERSCAN_API_KEY,
  //       infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  //     });
  //     // fetch eth info
  //     const ethAddress = this.ethClient.getAddress();
  //     const balances = await this.ethClient.getBalance();
  //     const ethBalance = ethers.utils.formatEther(
  //       balances[0].amount.amount().toString()
  //     );
  //     const ethTxs = await this.ethClient.getTransactions({
  //       address: ethAddress,
  //       limit: TXS_LIMIT,
  //     });
  //
  //     // fetch other erc20 assets info
  //     const erc20Assets = await this._fetchERC20Assets(accountAddress);
  //
  //     assets = {
  //       ...assets,
  //       [AssetType.Ethereum]: {
  //         id: AssetType.Ethereum,
  //         balance: Number(ethBalance),
  //         address: ethAddress,
  //         transactions: ethTxs.txs.map((tx) => {
  //           return {
  //             ...tx,
  //             balance: ethers.utils.formatEther(
  //               tx.from[0].amount.amount().toString()
  //             ),
  //           };
  //         }),
  //       },
  //       ...erc20Assets,
  //     };
  //   }
  //
  //   return {
  //     assets,
  //   };
  // }

  /**
   * Get latest update info of a account by account index
   *
   * @param index {number} account index of seed-phrase wallet
   * @returns {AccountInfo | null}
   */
  // async getAccountByIndex (id: string) {
  //   const masterKey: hdkey | null = await this.actions.getMasterKey(id);
  //   if (!masterKey) return null;
  //   this.privateKey = dag4.keyStore.deriveAccountFromMaster(masterKey, 0);
  //   return await this.getAccountByPrivateKey(this.privateKey, NetworkType.MultiChain, id);
  // }

  /**
   * Get latest update info of a account
   * by `id` of the keystore generated with a private key
   *
   * @param keystoreId {string} keystore id of imported keystores
   * @returns {AccountInfo | null}
   */
  // async getAccountByPrivKeystore (keystoreId: string) {
  //   const { keystores }: IVaultState = store.getState().vault;
  //   if (!this.password || !keystores[keystoreId]) return null;
  //   this.privateKey = await dag4.keyStore.decryptPrivateKey(
  //     keystores[keystoreId] as PrivKeystore,
  //     this.password
  //   );
  //   return await this.getAccountByPrivateKey(
  //     this.privateKey,
  //     keystoreId.startsWith(ETH_PREFIX)
  //       ? NetworkType.Ethereum
  //       : NetworkType.Constellation
  //   );
  // }
  //
  // async subscribeAccount (id: string, label?: string) {
  //   const { accounts }: IVaultState = store.getState().vault;
  //   const accountInfo: IAccountInfo | null = await this.getAccountByIndex(id);
  //
  //   console.log('warning ===> ', accountInfo);
  //
  //   if (!accountInfo) return null;
  //   this.wallet = {
  //     id,
  //     label: label || `Account ${Object.keys(accounts).length + 1}`,
  //     ...accountInfo,
  //     // activeAssetId: AssetType.Constellation,
  //     type: AccountType.Seed,
  //   };
  //
  //   store.dispatch(createAccount(this.wallet));
  //   return this.wallet.assets[0].address;
  // }
  //

  async removeWallet (id: string, pwd: string) {
    if (!this.keyringManager.checkPassword(pwd)) return false;
    await this.keyringManager.removeWalletById(id)
    // store.dispatch(removeKeystoreInfo(wallet));
    // store.dispatch(removeAccount(wallet));
    store.dispatch(updateStatus());
    return true;
  }

  // const addNewAccount = async (label: string) => {
  //   const { accounts }: IVaultState = store.getState().vault;
  //   const seedAccounts = Object.values(accounts).filter(
  //     (account) => account.type === AccountType.Seed
  //   );
  //   let idx = -1;
  //   Object.keys(seedAccounts).forEach((index, i) => {
  //     if (index !== String(i)) {
  //       idx = i;
  //       return;
  //     }
  //   });
  //   if (idx === -1) {
  //     idx = Object.keys(seedAccounts).length;
  //   }
  //   return await subscribeAccount(idx, label);
  // }

  // unsubscribeAccount (index: number, pwd: string) {
  //   if (this.actions.checkPassword(pwd)) {
  //     store.dispatch(removeAccount(String(index)));
  //     store.dispatch(updateStatus());
  //     return true;
  //   }
  //   return false;
  // }

  // async importPrivKeyAccount (
  //   privKey: string,
  //   label: string,
  //   importWalletType: ImportWalletType
  // ) {
  //   if (!label) return null;
  //
  //   const keystore = await this.actions.importPrivKey(privKey, importWalletType);
  //   if (!keystore) return null;
  //
  //   const { accounts }: IVaultState = store.getState().vault;
  //   const accountInfo = await this.getAccountByPrivateKey(privKey, importWalletType);
  //
  //   const activeAssetId =
  //     importWalletType === NetworkType.Ethereum
  //       ? AssetType.Ethereum
  //       : AssetType.Constellation;
  //
  //   const id = `${importWalletType === NetworkType.Ethereum ? ETH_PREFIX : ''}${
  //     keystore.id
  //   }`;
  //
  //   // check if the same account exists
  //   const isExisting =
  //     Object.values(accounts).filter(
  //       (acc) =>
  //         acc.assets[activeAssetId] &&
  //         acc.assets[activeAssetId].address ===
  //           accountInfo.assets[activeAssetId].address
  //     ).length > 0;
  //
  //   if (isExisting) {
  //     store.dispatch(removeKeystoreInfo(id));
  //     return null;
  //   }
  //
  //   this.privateKey = privKey;
  //   this.wallet = {
  //     id: id,
  //     label: label,
  //     ...accountInfo,
  //     activeAssetId: activeAssetId,
  //     type: AccountType.PrivKey,
  //   };
  //
  //   store.dispatch(createAccount(this.wallet));
  //   return this.wallet.assets[0].address;
  // }

  // getPrimaryAccount (pwd: string) {
  //   const { accounts, activeAccountId }: IVaultState = store.getState().vault;
  //   if (!this.actions.checkPassword(pwd)) return;
  //   this.password = pwd;
  //   this.getLatestUpdate();
  //   if (!this.wallet && accounts && Object.keys(accounts).length) {
  //     // this.account = accounts[activeAccountId];
  //     store.dispatch(updateStatus());
  //   }
  // }

  async getLatestUpdate () {
    const { wallet }: IVaultState = store.getState().vault;

    if ( !wallet || wallet.type === undefined) return;

    // const accLatestInfo =
    //   wallet.type === KeyringWalletType.MultiChainWallet
    //     ? await this.getAccountByIndex(activeAccountId)
    //     : await this.getAccountByPrivKeystore(activeAccountId);
    //
    // if (!accLatestInfo) return;

    // check pending DAG txs
    // const memPool = window.localStorage.getItem('dag4-network-main-mempool');
    // if (memPool) {
    //   const pendingTxs = JSON.parse(memPool);
    //   pendingTxs.forEach((pTx: PendingTx) => {
    //     if (
    //       !this.wallet ||
    //       (this.wallet.assets[AssetType.Constellation].address !== pTx.sender &&
    //         this.wallet.assets[AssetType.Constellation].address !== pTx.receiver) ||
    //       accLatestInfo.assets[AssetType.Constellation].transactions.filter(
    //         (tx: Transaction) => tx.hash === pTx.hash
    //       ).length > 0
    //     )
    //       return;
    //     accLatestInfo.assets[AssetType.Constellation].transactions.unshift(
    //       this._coventDAGPendingTx(pTx)
    //     );
    //   });
    // }

    // monitor ETH Txs
    this.txController.startMonitor();

    // store.dispatch(
    //   updateAccount({
    //     id: activeAccountId,
    //     ...accLatestInfo,
    //   })
    // );
  }

  // async getPrivKey (id: string, pwd: string) {
  //   const { keystores, accounts }: IVaultState = store.getState().vault;
  //   if (!this.account || !this.actions.checkPassword(pwd)) return null;
  //   if (accounts[id].type === AccountType.Seed) {
  //     const masterKey: hdkey | null = await this.actions.getMasterKey(id);
  //     if (!masterKey) return null;
  //     return dag4.keyStore.deriveAccountFromMaster(masterKey, 0);
  //   } else {
  //     const privkey = await dag4.keyStore.decryptPrivateKey(
  //       keystores[id] as PrivKeystore,
  //       pwd
  //     );
  //     return privkey;
  //   }
  // }

  updateWalletLabel (wallet: IWalletState, label: string) {
    store.dispatch(updateLabel({ wallet, label }));
  }

  updateAccountActiveAsset (asset: IAssetState) {
    store.dispatch(changeActiveAsset({ asset }));
    this.getLatestUpdate();
  }

  // @ts-ignore
  async addNewAsset (info: IAssetInfoState) {
    // const asset = await this._fetchSingleERC20Asset(info);
    // if (asset) {
    //   store.dispatch(addAsset({asset}));
    // }
  }

  // Tx-RelatedupdateAccountLabel
  updateTempTx (tx: ITransactionInfo) {
    if (dag4.account.isActive()) {
      this.tempTx = { ...this.tempTx, ...tx };
      this.tempTx.fromAddress = this.tempTx.fromAddress.trim();
      this.tempTx.toAddress = this.tempTx.toAddress.trim();
    }
  }

  getTempTx () {
    return dag4.account.isActive() ? this.tempTx : null;
  }

  async updateTxs (limit = 10, searchAfter?: string) {
    const { asset }: IVaultState = store.getState().vault;
    if (!asset) return;
    const newTxs = await dag4.account.getTransactions(limit, searchAfter);
    store.dispatch(
      updateTransactions({
        txs: [
          ...asset.transactions,
          ...newTxs,
        ],
      })
    );
  }

  // watchMemPool () {
  //   if (this.intervalId) return;
  //   this.intervalId = setInterval(async () => {
  //     await this.getLatestUpdate();
  //     const {
  //       activeAccountId,
  //       accounts,
  //     }: IVaultState = store.getState().vault;
  //     if (
  //       !accounts[activeAccountId] ||
  //       !accounts[activeAccountId].assets[AssetType.Constellation]
  //         .transactions ||
  //       !accounts[activeAccountId].assets[
  //         AssetType.Constellation
  //       ].transactions.filter((tx: Transaction) => tx.fee === -1).length
  //     ) {
  //       clearInterval(this.intervalId);
  //     }
  //   }, 30 * 1000);
  // }

  async confirmTempTx () {
    if (!dag4.account.isActive) {
      throw new Error('Error: No signed account exists');
    }
    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    try {
      const { asset }: IVaultState = store.getState().vault;
      const assets: IAssetListState = store.getState().assets;

      if (asset.type === AssetType.Constellation) {
        const pendingTx = await dag4.account.transferDag(
          this.tempTx.toAddress,
          this.tempTx.amount,
          this.tempTx.fee
        );
        dag4.monitor.addToMemPoolMonitor(pendingTx);
        store.dispatch(
          updateTransactions({
            txs: [
              this._coventDAGPendingTx(pendingTx),
              ...asset.transactions,
            ],
          })
        );
        //this.watchMemPool();
      } else {
        if (!this.tempTx.ethConfig) return;
        const { gas, gasLimit, nonce } = this.tempTx.ethConfig;
        console.log('gas gasLimit', gas, gasLimit);
        const { activeNetwork }: IVaultState = store.getState().vault;
        const txOptions: any = {
          recipient: this.tempTx.toAddress,
          amount: utils.baseAmount(
            ethers.utils.parseEther(this.tempTx.amount.toString()).toString(),
            18
          ),
          gasPrice: gas
            ? utils.baseAmount(
                ethers.utils.parseUnits(gas.toString(), 'gwei').toString(),
                9
              )
            : undefined,
          gasLimit:
            gasLimit && asset.type === AssetType.Ethereum
              ? BigNumber.from(gasLimit)
              : undefined,
          nonce: nonce,
        };
        if (asset.type !== AssetType.Ethereum) {
          txOptions.asset = utils.assetFromString(
            `${utils.ETHChain}.${assets[asset.id].symbol}-${
              assets[asset.id].contract
            }`
          );
          txOptions.amount = utils.baseAmount(
            ethers.utils
              .parseUnits(
                this.tempTx.amount.toString(),
                assets[asset.id].decimals
              )
              .toString(),
            assets[asset.id].decimals
          );
        }
        const txHash = await this.ethClient.transfer(txOptions);
        this.txController.addPendingTx({
          txHash,
          fromAddress: this.tempTx.fromAddress,
          toAddress: this.tempTx.toAddress,
          amount: this.tempTx.amount,
          network: activeNetwork[AssetType.Ethereum] as ETHNetwork,
          assetId: asset.id,
          timestamp: new Date().getTime(),
        });
      }
      this.tempTx = null;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Other
  isValidDAGAddress (address: string) {
    return dag4.account.validateDagAddress(address);
  }

  isValidERC20Address (address: string) {
    return this.ethClient.validateAddress(address);
  }

  async getRecommendFee () {
    return await dag4.account.getFeeRecommendation();
  }

  async getLatestGasPrices () {
    const gasPrices = await this.ethClient.estimateGasPrices();
    const results = Object.values(gasPrices).map((gas) => {
      return Number(
        ethers.utils.formatUnits(gas.amount().toString(), 'gwei').toString()
      );
    });
    if (results[0] === results[1]) {
      results[1] = Math.round((results[0] + results[2]) / 2);
    }
    return results;
  }

  async getRecommendETHTxConfig () {
    const txHistory = await this.ethClient.getTransactions();
    const nonce = txHistory.txs.length;
    const gasPrices = await this.ethClient.estimateGasPrices();
    const gasLimit = 21000;

    const recommendConfig = {
      nonce,
      gas: Number(
        ethers.utils
          .formatUnits(gasPrices.average.amount().toString(), 'gwei')
          .toString()
      ),
      gasLimit,
    };

    if (!this.tempTx) {
      this.tempTx = { fromAddress: '', toAddress: '', amount: 0 }
      this.tempTx.ethConfig = recommendConfig;
    }

    return recommendConfig;
  }
/*
  const getLatestGasPrices = async () => {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const network = activeNetwork[AssetType.Ethereum] as ETHNetwork;

    let gasPrices: any;

    if (network === 'testnet') {
      gasPrices = {
        low: { amount: () => 1e-18 },
        average: { amount: () => 2e-18 },
        high: { amount: () => 2e-18 }
      };
    }
    else {
      gasPrices = await this.ethClient.estimateGasPrices();
    }

    const results = ['low','average','high'].map((gas) => {
      return Number(
        ethers.utils.formatUnits(gasPrices[gas].amount().toString(), 'gwei').toString()
      );
    });
    if (results[0] === results[1]) {
      results[1] = Math.round((results[0] + results[2]) / 2);
    }

    console.log('gasPrices: ' + gasPrices);
    return results;
  }

  const getRecommendETHTxConfig = async () => {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const network = activeNetwork[AssetType.Ethereum] as ETHNetwork;

    let nonce: number;
    let gasPrices: any;

    if (network === 'testnet') {
      nonce = await this.ethClient.getTransactionCount(this.ethClient.getAddress(), 3);
      gasPrices = { average: { amount: () => 1e-18 } };
    }
    else {
      nonce = await this.ethClient.getTransactionCount(this.ethClient.getAddress());
      gasPrices = await this.ethClient.estimateGasPrices();
    }

    const gasLimit = 21000;

    const recommendConfig = {
      nonce,
      gas: Number(
        ethers.utils
          .formatUnits(gasPrices.average.amount().toString(), 'gwei')
          .toString()
      ) + 0.1,
      gasLimit,
    };

    if (!tempTx) {
      tempTx = { fromAddress: '', toAddress: '', amount: 0 }
      tempTx.ethConfig = recommendConfig;
    }

    return recommendConfig;
  }
*/

  updateETHTxConfig ({ nonce, gas, gasLimit}: {
    gas?: number;
    gasLimit?: number;
    nonce?: number;
    txData?: string;
  }) {
    if (!this.tempTx || !this.tempTx.ethConfig) return;
    this.tempTx.ethConfig = {
      ...this.tempTx.ethConfig,
      nonce: nonce || this.tempTx.ethConfig.nonce,
      gas: gas || this.tempTx.ethConfig.gas,
      gasLimit: gasLimit || this.tempTx.ethConfig.gasLimit,
    };
  }

  async estimateGasFee (gas: number, gasLimit = 21000) {
    const fee = ethers.utils
      .parseUnits(gas.toString(), 9)
      .mul(BigNumber.from(gasLimit));

    return Number(ethers.utils.formatEther(fee).toString());
  }

  getFullETHTxs() {
    return this.txController.getFullTxs();
  }

}

