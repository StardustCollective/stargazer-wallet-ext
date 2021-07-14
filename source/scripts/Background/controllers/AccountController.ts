import { dag4 } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import { utils, XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { PendingTx, Transaction } from '@stardust-collective/dag4-network';

import store from 'state/store';
import {
  changeActiveAsset,
  changeActiveWallet,
  updateBalances,
  updateStatus,
  updateTransactions,
  updateWalletAssets
} from 'state/vault';
import IVaultState, { AssetType, IAssetState, IWalletState } from 'state/vault/types';

import { ETHNetwork, ITransactionInfo } from '../../types';
import IAssetListState from 'state/assets/types';
import TransactionController, { ITransactionController } from './TransactionController';

import { IAccountController } from './IAccountController';
import { KeyringManager, KeyringNetwork, KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { AccountMonitor } from '../helpers/accountMonitor';

// limit number of txs
const TXS_LIMIT = 10;

export class AccountController implements IAccountController {
  // intervalId: any;
  tempTx: ITransactionInfo | null;
  // wallet: IActiveWalletState | null;
  ethClient: XChainEthClient;
  txController: ITransactionController;
  monitor: Readonly<AccountMonitor>;

  constructor(private keyringManager: Readonly<KeyringManager>) {
    this.txController = Object.freeze(
      TransactionController({ getLatestUpdate: () => this.getLatestTxUpdate() })
    );
    this.monitor = new AccountMonitor();
  }

  /**
   * Convert pending DAG Tx type to standard Tx type
   *
   * @param pending {PendingTx}
   * @returns {Transaction}
   */
  private _coventDAGPendingTx (pending: PendingTx) {
    const { hash, amount, receiver, sender, timestamp } =  pending;
    return {
      hash,
      amount,
      receiver,
      sender,
      fee: -1,
      isDummy: false,
      timestamp: new Date(timestamp).toISOString(),
      lastTransactionRef: {},
      snapshotHash: '',
      checkpointBlock: '',
    } as Transaction;
  }

  async removeWallet (id: string, pwd: string) {
    if (!this.keyringManager.checkPassword(pwd)) return false;
    await this.keyringManager.removeWalletById(id)
    store.dispatch(updateStatus());
    return true;
  }

  async buildAccountAssetInfo (walletId: string) {

    const state = store.getState();
    const vault: IVaultState = state.vault;
    const activeNetwork = vault.activeNetwork;
    // const assetInfoMap: IAssetListState = state.assets;
    const wallets: KeyringWalletState[] = vault.wallets;

    let buildAssetList: IAssetState[] = [];

    const walletInfo = wallets.find(w => w.id === walletId);

    for (let i = 0; i < walletInfo.accounts.length; i++) {
      const account = walletInfo.accounts[i];
      const privateKey = this.keyringManager.exportAccountPrivateKey(account.address);

      if (account.network === KeyringNetwork.Constellation) {

        dag4.account.loginPrivateKey(privateKey);
        //NOTE: need address in order to use getBalance, getTransactions
        //dag4.account.setKeysAndAddress(null, null, asset.address);

        // fetch dag info
        const dagBalance = await dag4.account.getBalance();
        //const dagTxs = await dag4.account.getTransactions(TXS_LIMIT);

        buildAssetList.push({
          id: AssetType.Constellation,
          type: AssetType.Constellation,
          label: 'Constellation',
          // balance: dagBalance || 0,
          address: account.address,
          //transactions: dagTxs
        });

        store.dispatch(updateBalances({ [AssetType.Constellation]: dagBalance }));
      }
      else if (account.network === KeyringNetwork.Ethereum) {

        this.ethClient = new XChainEthClient({
          network: activeNetwork[AssetType.Ethereum] as ETHNetwork,
          privateKey,
          etherscanApiKey: process.env.ETHERSCAN_API_KEY,
          infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' }
        });

        buildAssetList = buildAssetList.concat(this.buildAndMonitorEthAccount(account.tokens));

      }

    }

    const activeWallet: IWalletState = {
      id: walletInfo.id,
      type: walletInfo.type,
      label: walletInfo.label,
      supportedAssets: walletInfo.supportedAssets,
      assets: buildAssetList
    }

    store.dispatch(changeActiveWallet(activeWallet));

    this.monitor.start();
  }

  buildAndMonitorEthAccount (accountTokens: string[]) {
    const assetInfoMap: IAssetListState = store.getState().assets;

    const tokens = accountTokens.map(t => assetInfoMap[t])

    let assetList: IAssetState[] = [];

    assetList.push({
      id: AssetType.Ethereum,
      type: AssetType.Ethereum,
      label: 'Ethereum',
      address: this.ethClient.getAddress()
    });

    assetList = assetList.concat(tokens.map(t => {
      return {
        id: t.address,
        type: AssetType.ERC20,
        label: t.label,
        address: t.address
      }
    }));

    return assetList;
  }

  // async getLatestUpdate () {
  //   // const { activeAccountId, accounts }: IWalletState = store.getState().wallet;
  //   const { activeAsset, activeWallet }: IVaultState = store.getState().vault;
  //   if (!activeAsset) {
  //     return;
  //   }
  //
  //   let accLatestInfo: IAccountInfo | null = null;
  //
  //   if(accounts[activeAccountId].type === AccountType.Seed) {
  //     accLatestInfo = await getAccountByIndex(Number(activeAccountId));
  //   }
  //   else if(accounts[activeAccountId].type === AccountType.PrivKey) {
  //     accLatestInfo = await getAccountByPrivKeystore(activeAccountId);
  //   }
  //   else {
  //     accLatestInfo = await getAccountByAddress(accounts[activeAccountId].address.constellation);
  //   }
  //
  //   if (!accLatestInfo) return;
  //
  //   account = accounts[activeAccountId];
  //   // check pending txs
  //   const memPool = window.localStorage.getItem('stargazer-network-main-mempool');
  //   if (memPool) {
  //     const pendingTxs = JSON.parse(memPool);
  //     console.log(pendingTxs);
  //     pendingTxs.forEach((pTx: PendingTx) => {
  //       if (
  //         !account ||
  //         (account.address.constellation !== pTx.sender &&
  //           account.address.constellation !== pTx.receiver) ||
  //         (accLatestInfo as IAccountInfo).transactions.filter(
  //           (tx: Transaction) => tx.hash === pTx.hash
  //         ).length > 0
  //       )
  //         return;
  //       accLatestInfo!.transactions.unshift(_coventPendingType(pTx));
  //     });
  //   }
  //
  //   store.dispatch(
  //     updateAccount({
  //       id: activeAccountId,
  //       balance: accLatestInfo.balance,
  //       transactions: accLatestInfo.transactions,
  //     })
  //   );
  // };

  async getLatestTxUpdate () {
    const { activeAsset }: IVaultState = store.getState().vault;

    if (!activeAsset) return;

    if (activeAsset.type === AssetType.Constellation) {
      // fetch dag info
      const txs = await dag4.account.getTransactions(TXS_LIMIT);

      store.dispatch(updateTransactions({txs}));
    }
    else  if (activeAsset.type === AssetType.Ethereum) {
      this.txController.startMonitor();
    }

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

  }

  updateWalletLabel (id: string, label: string) {
    this.keyringManager.setWalletLabel(id, label);
  }

  updateAccountActiveAsset (asset: IAssetState) {
    store.dispatch(changeActiveAsset(asset));
    this.getLatestTxUpdate();
  }

  async addNewToken (address: string) {
    const { activeWallet }: IVaultState = store.getState().vault;
    const account = this.keyringManager.addTokenToAccount(activeWallet.id, this.ethClient.getAddress(), address);
    const tokenAssets = this.buildAndMonitorEthAccount(account.getTokens());
    const newToken = tokenAssets.find(t => t.address === address);
    store.dispatch(updateWalletAssets(activeWallet.assets.concat([newToken])));

    this.monitor.start();
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
    const { activeAsset }: IVaultState = store.getState().vault;
    if (!activeAsset) return;
    const newTxs = await dag4.account.getTransactions(limit, searchAfter);
    store.dispatch(
      updateTransactions({
        txs: [
          ...activeAsset.transactions,
          ...newTxs,
        ],
      })
    );
  };

  //  watchMemPool() {
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //   }
  //
  //   this.checkMemPool();
  //
  //   intervalId = setInterval( () => {
  //     this.checkMemPool();
  //   }, 30 * 1000);
  // }
  //
  // async checkMemPool() {
  //
  //     await getLatestUpdate();
  //     const {
  //       activeAccountId,
  //       accounts,
  //     }: IWalletState = store.getState().wallet;
  //     if (
  //       !accounts[activeAccountId] ||
  //       !accounts[activeAccountId].transactions ||
  //       !accounts[activeAccountId].transactions.filter(
  //         (tx: Transaction) => tx.fee === -1
  //       ).length
  //     ) {
  //       clearInterval(intervalId);
  //       intervalId = null;
  //     }
  //
  // };

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

    const { activeAsset }: IVaultState = store.getState().vault;
    const assets: IAssetListState = store.getState().assets;

    if (!activeAsset) {
      throw new Error("Error: Can't find active account info");
    }

    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    try {


      if (activeAsset.type === AssetType.Constellation) {
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
              ...activeAsset.transactions,
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
            gasLimit && activeAsset.type === AssetType.Ethereum
              ? BigNumber.from(gasLimit)
              : undefined,
          nonce: nonce,
        };
        if (activeAsset.type !== AssetType.Ethereum) {
          txOptions.asset = utils.assetFromString(
            `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${
              assets[activeAsset.id].address
            }`
          );
          txOptions.amount = utils.baseAmount(
            ethers.utils
              .parseUnits(
                this.tempTx.amount.toString(),
                assets[activeAsset.id].decimals
              )
              .toString(),
            assets[activeAsset.id].decimals
          );
        }
        const txHash = await this.ethClient.transfer(txOptions);
        this.txController.addPendingTx({
          txHash,
          fromAddress: this.tempTx.fromAddress,
          toAddress: this.tempTx.toAddress,
          amount: this.tempTx.amount,
          network: activeNetwork[AssetType.Ethereum] as ETHNetwork,
          assetId: activeAsset.id,
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

