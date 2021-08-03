import { dag4 } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import { utils, XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';

import store from 'state/store';
import {
  changeActiveAsset,
  changeActiveWallet,
  updateStatus,
  updateTransactions,
  updateWalletAssets
} from 'state/vault';
import IVaultState, { AssetType, IAssetState, IWalletState } from 'state/vault/types';

import { ETHNetwork, ITransactionInfo } from '../../types';
import IAssetListState from 'state/assets/types';
import { EthTransactionController } from './EthTransactionController';

import { IAccountController } from './IAccountController';
import { KeyringManager, KeyringNetwork, KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';

// limit number of txs
const TXS_LIMIT = 10;

export class AccountController implements IAccountController {
  tempTx: ITransactionInfo | null;
  ethClient: XChainEthClient;
  txController: EthTransactionController;
  assetsBalanceMonitor: Readonly<AssetsBalanceMonitor>;

  constructor(private keyringManager: Readonly<KeyringManager>) {
    this.txController = new EthTransactionController();
    this.assetsBalanceMonitor = new AssetsBalanceMonitor();
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

        buildAssetList.push({
          id: AssetType.Constellation,
          type: AssetType.Constellation,
          label: 'Constellation',
          // balance: dagBalance || 0,
          address: account.address,
          //transactions: dagTxs
        });
      }
      else if (account.network === KeyringNetwork.Ethereum) {

        this.ethClient = new XChainEthClient({
          network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
          privateKey,
          etherscanApiKey: process.env.ETHERSCAN_API_KEY,
          infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' }
        });

        buildAssetList = buildAssetList.concat(this.buildAccountEthTokens(account.address, account.tokens));
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
  }

  buildAccountEthTokens (address: string, accountTokens: string[]) {
    const assetInfoMap: IAssetListState = store.getState().assets;

    const tokens = accountTokens.map(t => assetInfoMap[t])

    let assetList: IAssetState[] = [];

    assetList.push({
      id: AssetType.Ethereum,
      type: AssetType.Ethereum,
      label: 'Ethereum',
      address
    });

    assetList = assetList.concat(tokens.map(t => {
      return {
        id: t.address,
        type: AssetType.ERC20,
        label: t.label,
        contractAddress: t.address,
        address
      }
    }));

    return assetList;
  }

  async getLatestTxUpdate () {
    const state = store.getState();
    const { activeAsset }: IVaultState = state.vault;
    const assets: IAssetListState = state.assets;

    if (!activeAsset) return;

    if (activeAsset.type === AssetType.Constellation) {
      const txs = await dag4.monitor.getLatestTransactions(activeAsset.address, TXS_LIMIT);

      store.dispatch(updateTransactions({txs}));
    }
    else if (activeAsset.type === AssetType.Ethereum) {

      const txs: any = await this.txController.getTransactionHistory(activeAsset.address, TXS_LIMIT);

      store.dispatch(updateTransactions({txs: txs.transactions}));
    }
    else if (activeAsset.type === AssetType.ERC20) {

      const txs: any = await this.txController.getTokenTransactionHistory(activeAsset.address, assets[activeAsset.id], TXS_LIMIT);

      store.dispatch(updateTransactions({txs: txs.transactions}));
    }
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
    const tokenAssets = this.buildAccountEthTokens(address, account.getTokens());
    const newToken = tokenAssets.find(t => t.address === address);
    store.dispatch(updateWalletAssets(activeWallet.assets.concat([newToken])));

    //restart monitor to include new token
    this.assetsBalanceMonitor.start();
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

  getTempTx () {
    return dag4.account.isActive() ? this.tempTx : null;
  }

  updateTempTx (tx: ITransactionInfo) {
    if (dag4.account.isActive()) {
      this.tempTx = { ...this.tempTx, ...tx };
      this.tempTx.fromAddress = this.tempTx.fromAddress.trim();
      this.tempTx.toAddress = this.tempTx.toAddress.trim();
    }
  }

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
          Number(this.tempTx.amount),
          this.tempTx.fee
        );
        const tx = dag4.monitor.addToMemPoolMonitor(pendingTx);
        store.dispatch(
          updateTransactions({
            txs: [tx, ...activeAsset.transactions],
          })
        );
        //this.watchMemPool();
      } else {
        if (!this.tempTx.ethConfig) return;
        const { gasPrice, gasLimit, nonce } = this.tempTx.ethConfig;
        // console.log('gas gasLimit', gas, gasLimit);
        const { activeNetwork }: IVaultState = store.getState().vault;
        const txOptions: any = {
          recipient: this.tempTx.toAddress,
          amount: utils.baseAmount(
              ethers.utils.parseUnits(
                this.tempTx.amount.toString(),
                assets[activeAsset.id].decimals
              ).toString(),
            assets[activeAsset.id].decimals
          ),
          gasPrice: gasPrice
            ? utils.baseAmount(
                ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(),
                9
              )
            : undefined,
          gasLimit: gasLimit && BigNumber.from(gasLimit),
          nonce: nonce,
        };
        if (activeAsset.type !== AssetType.Ethereum) {
          txOptions.asset = utils.assetFromString(
            `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${
              assets[activeAsset.id].address
            }`
          );
        }
        const txHash = await this.ethClient.transfer(txOptions);
        this.txController.addPendingTx({
          txHash,
          fromAddress: this.tempTx.fromAddress,
          toAddress: this.tempTx.toAddress,
          amount: this.tempTx.amount,
          network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
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
        ethers.utils.formatUnits(gas.amount().toString(), 'gwei')
      );
    });
    // if (results[0] === results[1]) {
    //   results[1] = Math.round((results[0] + results[2]) / 2);
    // }
    return results;
  }

  async getRecommendETHTxConfig () {
    const txHistory = await this.ethClient.getTransactions();
    const nonce = txHistory.txs.length;
    const gasPrices = await this.getLatestGasPrices()
    const gasLimit = 21000;

    const recommendConfig = {
      nonce,
      gasPrice: Math.floor((gasPrices[1] + gasPrices[2]) / 2),
      gasLimit
    };

    if (!this.tempTx) {
      this.tempTx = { fromAddress: '', toAddress: '', amount: '0' }
      this.tempTx.ethConfig = recommendConfig;
    }

    return recommendConfig;
  }

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
      gasPrice: gas || this.tempTx.ethConfig.gasPrice,
      gasLimit: gasLimit || this.tempTx.ethConfig.gasLimit,
    };
  }

  async estimateTotalGasFee (gas: number, gasLimit = 21000) {
    const fee = ethers.utils
      .parseUnits(gas.toString(), 'gwei')
      .mul(BigNumber.from(gasLimit));

    return Number(ethers.utils.formatEther(fee).toString());
  }

  getFullETHTxs() {
    return this.txController.getFullTxs();
  }

}

