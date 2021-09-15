import { dag4 } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import {
  utils,
  XChainEthClient,
} from '@stardust-collective/dag4-xchain-ethereum';

import store from 'state/store';
import {
  changeActiveAsset,
  changeActiveWallet,
  updateStatus,
  updateTransactions,
  updateWalletAssets,
  updateWalletLabel,
} from 'state/vault';
import IVaultState, {
  AssetType,
  IAssetState,
  IWalletState,
} from 'state/vault/types';

import { ETHNetwork, ITransactionInfo } from '../../types';
import IAssetListState from 'state/assets/types';
import { EthTransactionController } from './EthTransactionController';

import { IAccountController } from './IAccountController';
import {
  KeyringManager,
  KeyringNetwork,
  KeyringWalletState,
} from '@stardust-collective/dag4-keyring';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';

// limit number of txs
const TXS_LIMIT = 10;
const ETH_TOKENS = [
  '0xa393473d64d2F9F026B60b6Df7859A689715d092',
  '0x3106a0a076BeDAE847652F42ef07FD58589E001f',
]; //LTX, ADS

export class AccountController implements IAccountController {
  tempTx: ITransactionInfo | null;
  ethClient: XChainEthClient;
  txController: EthTransactionController;
  assetsBalanceMonitor: Readonly<AssetsBalanceMonitor>;

  constructor(private keyringManager: Readonly<KeyringManager>) {
    this.txController = new EthTransactionController();
    this.assetsBalanceMonitor = new AssetsBalanceMonitor();
  }

  async removeWallet(id: string, pwd: string) {
    if (!this.keyringManager.checkPassword(pwd)) return false;
    await this.keyringManager.removeWalletById(id);
    store.dispatch(updateStatus());
    return true;
  }

  async buildAccountAssetInfo(walletId: string) {
    const state = store.getState();
    const vault: IVaultState = state.vault;
    const activeNetwork = vault.activeNetwork;
    const wallets: KeyringWalletState[] = vault.wallets;

    let buildAssetList: IAssetState[] = [];

    const walletInfo = wallets.find((w) => w.id === walletId);

    for (let i = 0; i < walletInfo.accounts.length; i++) {
      const account = walletInfo.accounts[i];
      const privateKey = this.keyringManager.exportAccountPrivateKey(
        account.address
      );

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
      } else if (account.network === KeyringNetwork.Ethereum) {
        this.ethClient = new XChainEthClient({
          network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
          privateKey,
          etherscanApiKey: process.env.ETHERSCAN_API_KEY,
          infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
        });

        const assets = await this.buildAccountEthTokens(
          account.address,
          ETH_TOKENS
        );

        buildAssetList = buildAssetList.concat(assets);
      }
    }

    const activeWallet: IWalletState = {
      id: walletInfo.id,
      type: walletInfo.type,
      label: walletInfo.label,
      supportedAssets: walletInfo.supportedAssets,
      assets: buildAssetList,
    };

    store.dispatch(changeActiveWallet(activeWallet));
  }

  async buildAccountEthTokens(address: string, accountTokens: string[]) {
    const assetInfoMap: IAssetListState = store.getState().assets;

    const resolveTokens = accountTokens.map(async (t) => {
      if (!assetInfoMap[t]) {
        await window.controller.assets.fetchTokenInfo(t);
      }
      return assetInfoMap[t];
    });

    const tokens = await Promise.all(resolveTokens);

    let assetList: IAssetState[] = [];

    assetList.push({
      id: AssetType.Ethereum,
      type: AssetType.Ethereum,
      label: 'Ethereum',
      address,
    });

    assetList = assetList.concat(
      tokens.map((t) => {
        return {
          id: t.address,
          type: AssetType.ERC20,
          label: t.label,
          contractAddress: t.address,
          address,
        };
      })
    );

    return assetList;
  }

  async getLatestTxUpdate() {
    const state = store.getState();
    const { activeAsset }: IVaultState = state.vault;
    const assets: IAssetListState = state.assets;

    if (!activeAsset) return;

    if (activeAsset.type === AssetType.Constellation) {
      const txs = await dag4.monitor.getLatestTransactions(
        activeAsset.address,
        TXS_LIMIT
      );

      store.dispatch(updateTransactions({ txs }));
    } else if (activeAsset.type === AssetType.Ethereum) {
      const txs: any = await this.txController.getTransactionHistory(
        activeAsset.address,
        TXS_LIMIT
      );

      store.dispatch(updateTransactions({ txs: txs.transactions }));
    } else if (activeAsset.type === AssetType.ERC20) {
      const txs: any = await this.txController.getTokenTransactionHistory(
        activeAsset.address,
        assets[activeAsset.id],
        TXS_LIMIT
      );

      store.dispatch(updateTransactions({ txs: txs.transactions }));
    }
  }

  updateWalletLabel(id: string, label: string) {
    this.keyringManager.setWalletLabel(id, label);

    const { activeWallet }: IVaultState = store.getState().vault;

    if (activeWallet.id === id) {
      store.dispatch(updateWalletLabel(label));
    }
  }

  async updateAccountActiveAsset(asset: IAssetState) {
    store.dispatch(changeActiveAsset(asset));
    await this.getLatestTxUpdate();
  }

  async addNewToken(address: string) {
    const { activeWallet }: IVaultState = store.getState().vault;
    const account = this.keyringManager.addTokenToAccount(
      activeWallet.id,
      this.ethClient.getAddress(),
      address
    );
    const tokenAssets = await this.buildAccountEthTokens(
      address,
      account.getTokens()
    );
    const newToken = tokenAssets.find((t) => t.address === address);
    store.dispatch(updateWalletAssets(activeWallet.assets.concat([newToken])));

    //restart monitor to include new token
    this.assetsBalanceMonitor.start();
  }

  async updateTxs(limit = 10, searchAfter?: string) {
    const { activeAsset }: IVaultState = store.getState().vault;
    if (!activeAsset) return;
    const newTxs = await dag4.account.getTransactions(limit, searchAfter);
    store.dispatch(
      updateTransactions({
        txs: [...activeAsset.transactions, ...newTxs],
      })
    );
  }

  getTempTx() {
    return dag4.account.isActive() ? this.tempTx : null;
  }

  updateTempTx(tx: ITransactionInfo) {
    if (dag4.account.isActive()) {
      this.tempTx = { ...this.tempTx, ...tx };
      this.tempTx.fromAddress = this.tempTx.fromAddress.trim();
      this.tempTx.toAddress = this.tempTx.toAddress.trim();
    }
  }

  async updatePendingTx(tx: ITransactionInfo, gasPrice: number) {
    const { activeAsset }: IVaultState = store.getState().vault;
    const assets: IAssetListState = store.getState().assets;

    const txOptions: any = {
      recipient: tx.toAddress,
      amount: utils.baseAmount(
        ethers.utils
          .parseUnits(tx.amount, assets[activeAsset.id].decimals)
          .toString(),
        assets[activeAsset.id].decimals
      ),
      gasPrice: gasPrice
        ? utils.baseAmount(
            ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(),
            9
          )
        : undefined,
      gasLimit: BigNumber.from(21000),
      nonce: tx.nonce,
    };
    if (activeAsset.type !== AssetType.Ethereum) {
      txOptions.asset = utils.assetFromString(
        `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${
          assets[activeAsset.id].address
        }`
      );
    }
    console.log(txOptions);
    await this.ethClient.transfer(txOptions);
    tx = null;
  }

  async confirmTempTx() {
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
        const { activeNetwork }: IVaultState = store.getState().vault;
        const txOptions: any = {
          recipient: this.tempTx.toAddress,
          amount: utils.baseAmount(
            ethers.utils
              .parseUnits(
                this.tempTx.amount.toString(),
                assets[activeAsset.id].decimals
              )
              .toString(),
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
        const txData: any = await this.ethClient.transfer(txOptions);

        this.txController.addPendingTx({
          txHash: txData.hash,
          fromAddress: this.tempTx.fromAddress,
          toAddress: this.tempTx.toAddress,
          amount: this.tempTx.amount,
          network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
          assetId: activeAsset.id,
          timestamp: new Date().getTime(),
          nonce: txData.nonce,
          gasPrice: gasPrice,
        });
      }
      this.tempTx = null;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // Other
  isValidDAGAddress(address: string) {
    return dag4.account.validateDagAddress(address);
  }

  isValidERC20Address(address: string) {
    return this.ethClient.validateAddress(address);
  }

  async getRecommendFee() {
    return await dag4.account.getFeeRecommendation();
  }

  async getLatestGasPrices() {
    const gasPrices = await this.ethClient.estimateGasPrices();
    const results = Object.values(gasPrices).map((gas) => {
      return Number(ethers.utils.formatUnits(gas.amount().toString(), 'gwei'));
    });
    // if (results[0] === results[1]) {
    //   results[1] = Math.round((results[0] + results[2]) / 2);
    // }
    return results;
  }

  async getRecommendETHTxConfig() {
    const txHistory = await this.ethClient.getTransactions();
    const nonce = txHistory.txs.length;
    const gasPrices = await this.getLatestGasPrices();

    const recommendConfig = {
      nonce,
      gasPrice: Math.floor((gasPrices[1] + gasPrices[2]) / 2),
    };

    //console.log('getRecommendETHTxConfig', gasPrices, recommendConfig.gasPrice);

    if (!this.tempTx) {
      this.tempTx = {
        fromAddress: '',
        toAddress: '',
        amount: '0',
        timestamp: Date.now(),
      };
      this.tempTx.ethConfig = recommendConfig;
    }

    return recommendConfig;
  }

  updateETHTxConfig({
    nonce,
    gas,
    gasLimit,
  }: {
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

  async estimateTotalGasFee(
    recipient: string,
    amount: string,
    gas: number,
    gasLimit: number
  ) {
    console.log('ethClient.estimateGasLimit', arguments);
    if (!gasLimit || true) {
      const state = store.getState();
      const { activeAsset }: IVaultState = state.vault;
      const assetInfo = (state.assets as IAssetListState)[activeAsset.id];
      // const contractAddress = assetInfo.contractAddress;
      // const ticker = assetInfo.symbol;
      // const symbol = ticker + ':' + contractAddress;
      // const asset: any = { chain: 'ETH', symbol, ticker: symbol }
      // // const recipient = '0x0000000000000000000000000000000000000000';
      // const amount: any  = { amount: () => ({ toFixed: () => this.tempTx.amount }) };
      // const gasLimit0 = (await this.ethClient.estimateGasLimit({asset, recipient, amount})).toNumber();
      gasLimit = await this.ethClient.estimateTokenTransferGasLimit(
        recipient,
        assetInfo.address,
        ethers.utils.parseUnits(amount, assetInfo.decimals)
      );
      console.log('ethClient.estimateGasLimit2', gasLimit);
    }
    const fee = ethers.utils
      .parseUnits(gas.toString(), 'gwei')
      .mul(BigNumber.from(gasLimit));

    console.log('estimateTotalGasFee3', gas, gasLimit);

    return Number(ethers.utils.formatEther(fee).toString());
  }

  getFullETHTxs() {
    return this.txController.getFullTxs();
  }
}
