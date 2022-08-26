import { dag4 } from '@stardust-collective/dag4';
import { BigNumber, ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import store from 'state/store';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import {
  changeActiveAsset,
  changeActiveWallet,
  updateStatus,
  updateTransactions,
  updateWalletAssets,
  updateActiveWalletLabel,
  updateWalletLabel,
} from 'state/vault';

import IVaultState, {
  AssetType,
  IAssetState,
  IWalletState,
  IActiveAssetState,
  AssetSymbol,
} from 'state/vault/types';

import {
  KeyringManager,
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import { ITransactionInfo, IETHPendingTx } from '../../types';
import { EthTransactionController } from './EthTransactionController';

import { IAccountController } from './IAccountController';
import AssetsController, { IAssetsController } from './AssetsController';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';
import { utils } from './EVMChainController';
import NetworkController from './NetworkController';
import { setCustomAsset } from 'state/erc20assets';

// limit number of txs
const TXS_LIMIT = 10;

export class AccountController implements IAccountController {
  tempTx: ITransactionInfo | null;

  networkController: NetworkController;

  txController: EthTransactionController;

  assetsBalanceMonitor: Readonly<AssetsBalanceMonitor>;

  assetsController: IAssetsController;

  constructor(private keyringManager: Readonly<KeyringManager>) {
    this.txController = new EthTransactionController(this);
    this.assetsBalanceMonitor = new AssetsBalanceMonitor();
    this.assetsController = AssetsController();
  }

  async removeWallet(id: string, pwd: string) {
    if (!this.keyringManager.checkPassword(pwd)) return false;
    await this.keyringManager.removeWalletById(id);
    store.dispatch(updateStatus());
    return true;
  }

  async buildAccountAssetList(
    walletInfo: KeyringWalletState,
    account: KeyringWalletAccountState
  ): Promise<IAssetState[]> {
    const assets: IAssetListState = store.getState().assets;

    let privateKey = undefined;
    let publicKey = undefined;

    // Excludes bitfi and ledger accounts since we do not have access 
    // to the private key.
    if(walletInfo.type !== KeyringWalletType.LedgerAccountWallet && 
        walletInfo.type !== KeyringWalletType.BitfiAccountWallet
      ){
      privateKey = this.keyringManager.exportAccountPrivateKey(
        account.address
      );
    }else {
      publicKey = account.publicKey;
    }

    if (account.network === KeyringNetwork.Constellation) {
      if (privateKey) {
        dag4.account.loginPrivateKey(privateKey);
      } else {
        dag4.account.loginPublicKey(publicKey);
      }

      return [
        {
          id: AssetType.Constellation,
          type:
            walletInfo.type === KeyringWalletType.LedgerAccountWallet
              ? AssetType.LedgerConstellation
              : AssetType.Constellation,
          label: 'Constellation',
          address: account.address,
        },
      ];
    }

    // TODO-349: Check if we need to add logic for all networks here
    if (account.network === KeyringNetwork.Ethereum) {
      this.networkController = new NetworkController(privateKey);

      const ethAsset = {
        id: AssetType.Ethereum,
        type: AssetType.Ethereum,
        label: 'Ethereum',
        address: account.address,
      };
      
      const ERC_20_TOKENS = Object.values(assets)
                                .filter((token) => token.type === AssetType.ERC20)
                                .map((token) => token.id);

      // TODO-349: Only Polygon ['AVAX', 'BNB', 'MATIC']
      const NETWORK_TOKENS = Object.values(assets)
                                .filter((token) => [AssetSymbol.MATIC].includes(token.symbol as AssetSymbol))
                                .map((token) => token.id);

      const networkAssets = this.buildNetworkAssets(account.address, NETWORK_TOKENS);                          

      const erc20Assets = await this.buildAccountERC20Tokens(account.address, ERC_20_TOKENS);

      const erc721Assets = await this.buildAccountERC721Tokens(account.address);

      return [ethAsset, ...networkAssets, ...erc20Assets, ...erc721Assets];
    }

    console.log('Unknown account network: cannot build asset list');
    return [];
  }

  buildNetworkAssets(address: string, tokens: string[]): IAssetState[] {
    const networkAssets = [];
    
    // TODO-349: Only Polygon
    // const avaxAsset = {
    //   id: AssetType.Avalanche,
    //   type: AssetType.Ethereum,
    //   label: 'Avalanche',
    //   address,
    // };

    // const bscAsset = {
    //   id: AssetType.BSC,
    //   type: AssetType.Ethereum,
    //   label: 'BNB',
    //   address,
    // };

    const polygonAsset = {
      id: AssetType.Polygon,
      type: AssetType.Ethereum,
      label: 'Polygon',
      address,
    };

    // TODO-349: Only Polygon
    // if (tokens.includes(avaxAsset.id)) {
    //   networkAssets.push(avaxAsset);
    // }

    // if (tokens.includes(bscAsset.id)) {
    //   networkAssets.push(bscAsset);
    // }

    if (tokens.includes(polygonAsset.id)) {
      networkAssets.push(polygonAsset);
    }

    return networkAssets;
  }

  async buildAccountAssetInfo(walletId: string): Promise<void> {
    const state = store.getState();
    const { vault } = state;
    const { local, ledger, bitfi } = vault.wallets;
    const allWallets = [...local, ...ledger, ...bitfi];
    const walletInfo: KeyringWalletState = allWallets.find(
      (w: KeyringWalletState) => w.id === walletId
    );

    if (!walletInfo) {
      return;
    }

    let assetList: IAssetState[] = [];
    for (const account of walletInfo.accounts) {
      const accountAssetList = await this.buildAccountAssetList(walletInfo, account);

      assetList = assetList.concat(accountAssetList);
    }

    const activeWallet: IWalletState = {
      id: walletInfo.id,
      type: walletInfo.type,
      label: walletInfo.label,
      supportedAssets: walletInfo.supportedAssets,
      assets: assetList,
    };

    store.dispatch(changeActiveWallet(activeWallet));
  }

  async buildAccountERC20Tokens(address: string, accountTokens: string[]) {
    const assetInfoMap: IAssetListState = store.getState().assets;

    const resolveTokens = accountTokens.map(async (address) => {
      if (!assetInfoMap[address]) {
        try {
          // TODO-349: Check if this line is used
          // await this.assetsController.fetchTokenInfo(address);
        } catch (err: any) {
          // NOOP
        }
      }
      return assetInfoMap[address];
    });

    const tokens = (await Promise.all(resolveTokens)).filter((token) => !!token);

    const assetList: IAssetState[] = tokens.map((t) => ({
      id: t.id,
      type: AssetType.ERC20,
      label: t.label,
      contractAddress: t.address,
      address,
    }));

    return assetList;
  }

  async buildAccountERC721Tokens(address: string) {
    let nfts: any;
    try {
      nfts = await this.assetsController.fetchWalletNFTInfo(address);
    } catch (err: any) {
      return [];
    }

    if (!nfts.length) {
      return [];
    }

    const assetList: IAssetState[] = nfts.map((nft: any) => ({
      id: nft.id,
      type: nft.type,
      label: nft.name,
      contractAddress: nft.address,
      address,
    }));

    return assetList;
  }

  async getLatestTxUpdate() {
    const state = store.getState();
    const { activeAsset }: IVaultState = state.vault;
    const { assets } = state;

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

  updateWalletLabel(wallet: KeyringWalletState, label: string) {

    if (wallet.type !== KeyringWalletType.LedgerAccountWallet &&
      wallet.type !== KeyringWalletType.BitfiAccountWallet) {
      this.keyringManager.setWalletLabel(wallet.id, label);
    } else {
      // Hardware wallet label update:
      // We do not store any hardware wallet data in the Keyring
      // manager. Hardware wallet info must be manipulated directly
      // in the redux store state.vault.wallets.
      store.dispatch(updateWalletLabel({ wallet, label }));
    }

    const { activeWallet }: IVaultState = store.getState().vault;

    if (activeWallet.id === wallet.id) {
      store.dispatch(updateActiveWalletLabel(label));
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
      this.networkController.getAddress(),
      address
    );
    const tokenAssets = await this.buildAccountERC20Tokens(address, account.getTokens());
    const newToken = tokenAssets.find((t) => t.address === address);
    store.dispatch(updateWalletAssets(activeWallet.assets.concat([newToken])));

    // restart monitor to include new token
    this.assetsBalanceMonitor.start();
  }

  async updateTxs(limit = 10, searchAfter?: string) {
    /* eslint-disable-line default-param-last */
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

  async updatePendingTx(tx: IETHPendingTx, gasPrice: number, gasLimit: number) {
    const { activeAsset }: IVaultState = store.getState().vault;
    const { assets } = store.getState();

    const txOptions: any = {
      recipient: tx.toAddress,
      amount: utils.baseAmount(
        ethers.utils.parseUnits(tx.amount, assets[activeAsset.id].decimals).toString(),
        assets[activeAsset.id].decimals
      ),
      gasPrice: gasPrice
        ? utils.baseAmount(
          ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(),
          9
        )
        : undefined,
      gasLimit: BigNumber.from(gasLimit),
      nonce: tx.nonce,
    };

    if (activeAsset.type !== AssetType.Ethereum) {
      txOptions.asset = utils.assetFromString(
        `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${assets[activeAsset.id].address
        }`
      );
    }
    const newTx: TransactionResponse = await this.networkController.transfer(txOptions);
    await this.txController.removePendingTxHash(tx.txHash);
    await this.txController.addPendingTx({
      txHash: newTx.hash,
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount,
      network: tx.network,
      assetId: tx.assetId,
      timestamp: new Date().getTime(),
      nonce: newTx.nonce,
      gasPrice,
    });

    tx = null;
  }

  async confirmTempTx() {
    if (!dag4.account.isActive) {
      throw new Error('Error: No signed account exists');
    }

    const { activeAsset }: IVaultState = store.getState().vault;
    const { assets } = store.getState();

    if (!activeAsset) {
      throw new Error("Error: Can't find active account info");
    }

    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    let trxHash: string;

    if (activeAsset.type === AssetType.Constellation) {
      const pendingTx = await dag4.account.transferDag(
        this.tempTx.toAddress,
        Number(this.tempTx.amount),
        this.tempTx.fee
      );
      const tx = await dag4.monitor.addToMemPoolMonitor(pendingTx);
      store.dispatch(
        updateTransactions({
          txs: [tx, ...activeAsset.transactions],
        })
      );
      trxHash = tx.hash;
    } else {
      if (!this.tempTx.ethConfig) {
        throw new Error('No tempTx.ethConfig present');
      }

      const { gasPrice, gasLimit, nonce } = this.tempTx.ethConfig;
      const txOptions: any = {
        recipient: this.tempTx.toAddress,
        amount: utils.baseAmount(
          ethers.utils
            .parseUnits(this.tempTx.amount.toString(), assets[activeAsset.id].decimals)
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
        nonce,
      };
      // TODO-349: Check how this works for ERC-20 tokens in Polygon, Avalanche, etc.
      if (activeAsset.type !== AssetType.Ethereum) {
        txOptions.asset = utils.assetFromString(
          `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${assets[activeAsset.id].address
          }`
        );
      }
      
      const newTx: TransactionResponse = await this.networkController.transfer(txOptions);
      const { id: networkId } = this.networkController.getNetwork();

      trxHash = newTx.hash;
      await this.txController.addPendingTx({
        txHash: newTx.hash,
        fromAddress: this.tempTx.fromAddress,
        toAddress: this.tempTx.toAddress,
        amount: this.tempTx.amount,
        network: networkId,
        assetId: activeAsset.id,
        timestamp: new Date().getTime(),
        gasPrice,
      });
    }
    this.tempTx = null;

    if (!trxHash) {
      throw new Error('Transaction hash was not set');
    }

    return trxHash;
  }

  async confirmContractTempTx(activeAsset: IAssetInfoState | IActiveAssetState) {
    if (!dag4.account.isActive) {
      throw new Error('Error: No signed account exists');
    }

    if (!activeAsset) {
      throw new Error("Error: Can't find active account info");
    }

    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    if (!this.tempTx.ethConfig) {
      throw new Error('No tempTx.ethConfig present');
    }

    const { gasPrice, gasLimit, nonce, memo } = this.tempTx.ethConfig;

    const baseAmountGasPrice = utils.baseAmount(
      ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(),
      9
    );
    const bigNumberGasPrice = BigNumber.from(baseAmountGasPrice.amount().toFixed());
    const { chainId, id: networkId } = this.networkController.getNetwork();

    const txOptions: any = {
      to: this.tempTx.toAddress,
      value: ethers.utils.parseEther(this.tempTx.amount),
      gasPrice: bigNumberGasPrice,
      gasLimit: ethers.utils.hexlify(gasLimit),
      data: memo,
      chainId,
      nonce,
    };

    const txData = await this.networkController.getWallet().sendTransaction(txOptions);

    this.txController.addPendingTx({
      txHash: txData.hash,
      fromAddress: this.tempTx.fromAddress,
      toAddress: this.tempTx.toAddress,
      amount: this.tempTx.amount,
      network: networkId,
      assetId: activeAsset.id,
      timestamp: new Date().getTime(),
      nonce: txData.nonce,
      gasPrice,
      data: memo,
      onConfirmed: this.tempTx.onConfirmed,
    });

    this.tempTx = null;

    return txData.hash;
  }

  // Other
  isValidDAGAddress(address: string) {
    return dag4.account.validateDagAddress(address);
  }

  isValidERC20Address(address: string) {
    return this.networkController.validateAddress(address);
  }

  async fetchCustomToken(address: string, chainId: string) {
    let info = null;
    try {
      info = await this.networkController.getTokenInfo(address, chainId);
    } catch (err) {
      console.log('Error: Unable to fetch token info');
    }
    if (info) {
      store.dispatch(setCustomAsset({
        tokenAddress: info.address || '',
        tokenName: info.name || '',
        tokenSymbol: info.symbol || '',
        tokenDecimals: info.decimals?.toString() || '',
      }))
    }
  }

  async getRecommendFee() {
    return await dag4.account.getFeeRecommendation();
  }

  async getLatestGasPrices() {
    const gasPrices = await this.networkController.estimateGasPrices();
    const results = Object.values(gasPrices).map((gas) =>
      Number(ethers.utils.formatUnits(gas.amount().toString(), 'gwei'))
    );
    // if (results[0] === results[1]) {
    //   results[1] = Math.round((results[0] + results[2]) / 2);
    // }
    return results;
  }

  async getRecommendETHTxConfig() {
    const txHistory = await this.networkController.getTransactions();
    const nonce = txHistory.txs.length;
    const gasPrices = await this.getLatestGasPrices();

    const recommendConfig = {
      nonce,
      gasPrice: Math.floor((gasPrices[1] + gasPrices[2]) / 2),
    };

    // console.log('getRecommendETHTxConfig', gasPrices, recommendConfig.gasPrice);

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
      // const gasLimit0 = (await this.networkController.estimateGasLimit({asset, recipient, amount})).toNumber();
      gasLimit = await this.networkController.estimateTokenTransferGasLimit(
        recipient,
        assetInfo.address,
        ethers.utils.parseUnits(amount, assetInfo.decimals)
      );
      console.log('networkController.estimateGasLimit2', gasLimit);
    }
    const fee = ethers.utils
      .parseUnits(gas.toString(), 'gwei')
      .mul(BigNumber.from(gasLimit));

    console.log('estimateTotalGasFee3', gas, gasLimit);

    return Number(ethers.utils.formatEther(fee).toString());
  }

  async getFullETHTxs() {
    return this.txController.getFullTxs();
  }
}
