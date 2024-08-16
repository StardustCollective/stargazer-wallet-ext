import { dag4 } from '@stardust-collective/dag4';
import {
  MetagraphTokenNetwork,
  GlobalDagNetwork,
} from '@stardust-collective/dag4-network';
import { BigNumber, ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import store from 'state/store';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import {
  changeActiveAsset,
  changeActiveWallet,
  updateStatus,
  updateTransactions,
  updateActiveWalletLabel,
  updateWalletLabel,
  updateRewards,
  setLoadingTransactions,
  setPublicKey,
} from 'state/vault';

import IVaultState, {
  AssetType,
  IAssetState,
  IWalletState,
  IActiveAssetState,
  AssetSymbol,
  Reward,
} from 'state/vault/types';

import {
  KeyringManager,
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import { setCustomAsset } from 'state/erc20assets';
import { DAG_EXPLORER_API_URL, DAG_NETWORK } from 'constants/index';
import { ITransactionInfo, IETHPendingTx } from '../../types';
import { EthTransactionController } from './EthTransactionController';
import AssetsController, { IAssetsController } from './AssetsController';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';
import { utils } from './EVMChainController';
import NetworkController from './NetworkController';
import { toDatum } from 'utils/number';
import { isNative } from 'utils/envUtil';
import { DappMessage, DappMessageEvent, MessageType } from '../messaging/types';
import { ProtocolProvider } from 'scripts/common';

// limit number of txs
const TXS_LIMIT = 10;

export class AccountController {
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

  private async buildAccountAssetList(
    walletInfo: KeyringWalletState,
    account: KeyringWalletAccountState
  ): Promise<IAssetState[]> {
    const { assets } = store.getState();

    let privateKey;
    let publicKey;

    // Excludes bitfi and ledger accounts since we do not have access
    // to the private key.
    if (
      walletInfo.type !== KeyringWalletType.LedgerAccountWallet &&
      walletInfo.type !== KeyringWalletType.BitfiAccountWallet
    ) {
      privateKey = this.keyringManager.exportAccountPrivateKey(account.address);
    } else {
      publicKey = account.publicKey;
    }

    if (account.network === KeyringNetwork.Constellation) {
      if (privateKey) {
        dag4.account.loginPrivateKey(privateKey);
      } else {
        dag4.account.loginPublicKey(publicKey);
      }

      publicKey = dag4.account?.keyTrio?.publicKey ?? null;

      if (publicKey) {
        store.dispatch(setPublicKey(publicKey));
      }

      const dagAsset = {
        id: AssetType.Constellation,
        type:
          walletInfo.type === KeyringWalletType.LedgerAccountWallet
            ? AssetType.LedgerConstellation
            : AssetType.Constellation,
        label: 'Constellation',
        address: account.address,
      };

      const L0_TOKENS = Object.values(assets)
        .filter((token) => token.type === AssetType.Constellation && !!token.l0endpoint)
        .map((token) => token.id);

      const l0tokens = this.buildAccountL0Tokens(account.address, L0_TOKENS);

      return [dagAsset, ...l0tokens];
    }

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

      // 349: New network should be added here.
      const NETWORK_TOKENS = Object.values(assets)
        .filter((token) =>
          [AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(
            token.symbol as AssetSymbol
          )
        )
        .map((token) => token.id);

      const networkAssets = this.buildNetworkAssets(account.address, NETWORK_TOKENS);

      const erc20Assets = await this.buildAccountERC20Tokens(
        account.address,
        ERC_20_TOKENS
      );

      return [ethAsset, ...networkAssets, ...erc20Assets];
    }

    console.log('Unknown account network: cannot build asset list');
    return [];
  }

  private buildAccountL0Tokens(dagAddress: string, tokens: string[]): IAssetState[] {
    const { assets } = store.getState();

    if (!tokens?.length) return [];

    const assetList: IAssetState[] = tokens
      .filter((token) => !!assets[token])
      .map((token) => {
        const tokenInfo = assets[token];
        return {
          id: tokenInfo.id,
          type: AssetType.Constellation,
          label: tokenInfo.label,
          address: dagAddress,
          contractAddress: tokenInfo.address,
        };
      });

    return assetList;
  }

  private buildNetworkAssets(address: string, tokens: string[]): IAssetState[] {
    const networkAssets = [];

    // 349: New network should be added here.
    const avaxAsset = {
      id: AssetType.Avalanche,
      type: AssetType.Ethereum,
      label: 'Avalanche',
      address,
    };

    const bscAsset = {
      id: AssetType.BSC,
      type: AssetType.Ethereum,
      label: 'BNB',
      address,
    };

    const polygonAsset = {
      id: AssetType.Polygon,
      type: AssetType.Ethereum,
      label: 'Polygon',
      address,
    };

    if (tokens.includes(avaxAsset.id)) {
      networkAssets.push(avaxAsset);
    }

    if (tokens.includes(bscAsset.id)) {
      networkAssets.push(bscAsset);
    }

    if (tokens.includes(polygonAsset.id)) {
      networkAssets.push(polygonAsset);
    }

    return networkAssets;
  }

  async notifyAccountChange(
    account: KeyringWalletAccountState,
    walletInfo: KeyringWalletState
  ) {
    const { whitelist } = store.getState().dapp;

    const network =
      account.network === KeyringNetwork.Constellation
        ? ProtocolProvider.CONSTELLATION
        : ProtocolProvider.ETHEREUM;

    for (const site of Object.keys(whitelist)) {
      const origin = whitelist[site].origin;

      // This scenario is for only DAG/ETH wallets.
      // We should notify all connected dApps that the accounts array is now empty on the provider not used for this wallet.
      // Ex 1. Active wallet -> Only DAG -> Notify accountsChanged = [] on Ethereum's provider.
      // Ex 2. Active wallet -> Only ETH -> Notify accountsChanged = [] on Constellation's provider.
      if (
        [
          KeyringWalletType.SingleAccountWallet,
          KeyringWalletType.BitfiAccountWallet,
        ].includes(walletInfo.type)
      ) {
        const otherNetwork =
          account.network === KeyringNetwork.Constellation
            ? ProtocolProvider.ETHEREUM
            : ProtocolProvider.CONSTELLATION;

        const emptyAccountsMessage: DappMessage = {
          type: MessageType.dapp,
          event: DappMessageEvent.accountsChanged,
          payload: {
            network: otherNetwork,
            accounts: [],
            origin,
          },
        };
        await chrome.runtime.sendMessage(emptyAccountsMessage);
      }

      const message: DappMessage = {
        type: MessageType.dapp,
        event: DappMessageEvent.accountsChanged,
        payload: {
          network,
          accounts: [account.address],
          origin,
        },
      };
      await chrome.runtime.sendMessage(message);
    }
  }

  async buildAccountAssetInfo(walletId: string, walletLabel: string): Promise<void> {
    const state = store.getState();
    const { vault } = state;
    const { local, ledger, bitfi } = vault.wallets;
    const allWallets = [...local, ...ledger, ...bitfi];
    const walletInfo: KeyringWalletState = allWallets.find(
      (w: KeyringWalletState) => w.id === walletId || w.label === walletLabel
    );

    if (!walletInfo) {
      return;
    }

    let assetList: IAssetState[] = [];
    for (const account of walletInfo.accounts) {
      const accountAssetList = await this.buildAccountAssetList(walletInfo, account);

      if (!isNative) {
        await this.notifyAccountChange(account, walletInfo);
      }

      assetList = assetList.concat(accountAssetList);
    }

    const activeWallet: IWalletState = {
      id: walletInfo.id,
      type: walletInfo.type,
      label: walletInfo.label,
      supportedAssets: walletInfo.supportedAssets,
      assets: assetList,
    };

    // Ledger wallet will contain a bipIndex.
    if (walletInfo?.bipIndex !== undefined) {
      activeWallet.bipIndex = walletInfo.bipIndex;
    }

    store.dispatch(changeActiveWallet(activeWallet));
  }

  private async buildAccountERC20Tokens(address: string, accountTokens: string[]) {
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

  async getMetagraphRewards(
    network: string,
    walletAddress: string,
    metagraphId: string
  ): Promise<Reward[]> {
    const MAP_NETWORK: { [net: string]: string } = {
      main2: 'mainnet',
      test2: 'testnet',
      integration2: 'integrationnet',
    };
    const net = MAP_NETWORK[network];
    const URL = `${DAG_EXPLORER_API_URL}/${net}/addresses/${walletAddress}/metagraphs/${metagraphId}/rewards?groupingMode=day`;

    const response = await (await fetch(URL)).json();
    return response?.data ?? [];
  }

  async getDagRewards(network: string, walletAddress: string): Promise<Reward[]> {
    const MAP_NETWORK: { [net: string]: string } = {
      main2: 'mainnet',
      test2: 'testnet',
      integration2: 'integrationnet',
    };
    const net = MAP_NETWORK[network];
    const URL = `${DAG_EXPLORER_API_URL}/${net}/addresses/${walletAddress}/rewards?groupingMode=day`;

    const response = await (await fetch(URL)).json();
    return response?.data ?? [];
  }

  async getLatestTxUpdate(showLoading = true): Promise<void> {
    const state = store.getState();
    const { activeAsset, activeNetwork }: IVaultState = state.vault;
    const { assets } = state;

    if (!activeAsset) return;

    if (showLoading) {
      store.dispatch(setLoadingTransactions(true));
    }

    if (
      activeAsset.type === AssetType.Constellation ||
      activeAsset.type === AssetType.LedgerConstellation
    ) {
      // TODO-421: Check getLatestTransactions
      let txsV2: any = [];
      let rewards: Reward[] = [];
      const assetInfo = assets[activeAsset?.id];
      const isL0token = !!assetInfo?.l0endpoint && !!assetInfo?.l1endpoint;

      if (isL0token) {
        const { beUrl } = DAG_NETWORK[activeNetwork[KeyringNetwork.Constellation]].config;

        const metagraphClient = dag4.account.createMetagraphTokenClient({
          metagraphId: assetInfo.address,
          id: assetInfo.address,
          l0Url: assetInfo.l0endpoint,
          l1Url: assetInfo.l1endpoint,
          beUrl,
        });

        try {
          [txsV2, rewards] = await Promise.all([
            metagraphClient.getTransactions(TXS_LIMIT),
            this.getMetagraphRewards(
              assetInfo.network,
              activeAsset.address,
              assetInfo.address
            ),
          ]);
        } catch (err) {
          console.log('Error: getLatestTransactions', err);
          txsV2 = [];
          rewards = [];
        }
      } else {
        const { id } = dag4.network.getNetwork();

        try {
          [txsV2, rewards] = await Promise.all([
            dag4.monitor.getLatestTransactions(activeAsset.address, TXS_LIMIT),
            this.getDagRewards(id, activeAsset.address),
          ]);
        } catch (err) {
          console.log('Error: getLatestTransactions', err);
          txsV2 = [];
          rewards = [];
        }
      }

      rewards = rewards ?? [];
      txsV2 = txsV2 ?? [];

      store.dispatch(updateRewards({ txs: rewards }));
      store.dispatch(updateTransactions({ txs: [...txsV2] }));
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
    store.dispatch(setLoadingTransactions(false));
  }

  updateWalletLabel(wallet: KeyringWalletState, label: string): void {
    if (
      wallet.type !== KeyringWalletType.LedgerAccountWallet &&
      wallet.type !== KeyringWalletType.BitfiAccountWallet
    ) {
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

  async updateAccountActiveAsset(asset: IAssetState): Promise<void> {
    store.dispatch(changeActiveAsset(asset));
    await this.getLatestTxUpdate();
  }

  getTempTx(): ITransactionInfo | null {
    return dag4.account.isActive() ? this.tempTx : null;
  }

  updateTempTx(tx: ITransactionInfo): void {
    if (dag4.account.isActive()) {
      this.tempTx = { ...this.tempTx, ...tx };
      this.tempTx.fromAddress = this.tempTx.fromAddress.trim();
      this.tempTx.toAddress = this.tempTx.toAddress.trim();
    }
  }

  async updatePendingTx(
    tx: IETHPendingTx,
    gasPrice: number,
    gasLimit: number
  ): Promise<void> {
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
        `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${
          assets[activeAsset.id].address
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

  async waitForDagTransaction(
    txHash: string,
    oldTransactions: any[],
    networkInstance: MetagraphTokenNetwork | GlobalDagNetwork
  ): Promise<void> {
    const ATTEMPTS = 4;
    const WAITING_TIME = 20000; // 20 seconds

    let pendingTx = await networkInstance.getPendingTransaction(txHash);

    while (pendingTx !== null) {
      // Wait for 5 seconds before the next check
      await new Promise((resolve) => setTimeout(resolve, 5000));

      pendingTx = await networkInstance.getPendingTransaction(txHash);
    }

    if (pendingTx === null) {
      let confirmed = false;

      // Attempt to confirm the transaction up to 4 times
      for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        const confirmedTx = await networkInstance.getTransaction(txHash);

        if (confirmedTx) {
          // transaction confirmed, add tx, update store and break the loop.
          store.dispatch(
            updateTransactions({
              txs: [confirmedTx, ...oldTransactions],
            })
          );
          confirmed = true;
          return; // Exit the function after successful confirmation
        } else if (attempt < ATTEMPTS) {
          // If the transaction isn't confirmed and it's not the last attempt, wait for 20 seconds
          await new Promise((resolve) => setTimeout(resolve, WAITING_TIME));
        }
      }

      if (!confirmed) {
        // transaction not confirmed, remove pending tx and update store.
        store.dispatch(
          updateTransactions({
            txs: [...oldTransactions],
          })
        );
      }
    }
  }

  async confirmTempTx(): Promise<string> {
    if (!dag4.account.isActive()) {
      throw new Error('Error: No signed account exists');
    }

    const { activeAsset, activeNetwork }: IVaultState = store.getState().vault;
    const { assets } = store.getState();

    if (!activeAsset) {
      throw new Error("Error: Can't find active account info");
    }

    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    let trxHash: string;

    if (activeAsset.type === AssetType.Constellation) {
      const assetInfo = assets[activeAsset?.id];
      const isL0token = !!assetInfo?.l0endpoint && !!assetInfo?.l1endpoint;
      let pendingTx = null;
      let metagraphClient;

      if (isL0token) {
        const { beUrl } = DAG_NETWORK[activeNetwork[KeyringNetwork.Constellation]].config;

        metagraphClient = dag4.account.createMetagraphTokenClient({
          metagraphId: assetInfo.address,
          id: assetInfo.address,
          l0Url: assetInfo.l0endpoint,
          l1Url: assetInfo.l1endpoint,
          beUrl,
        });

        pendingTx = await metagraphClient.transfer(
          this.tempTx.toAddress,
          Number(this.tempTx.amount),
          this.tempTx.fee
        );
      } else {
        pendingTx = await dag4.account.transferDag(
          this.tempTx.toAddress,
          Number(this.tempTx.amount),
          this.tempTx.fee
        );
      }

      // Convert the amount from DAG to DATUM
      pendingTx.amount = toDatum(Number(this.tempTx.amount));
      const tx = await dag4.monitor.addToMemPoolMonitor(pendingTx);
      store.dispatch(
        updateTransactions({
          txs: [tx, ...activeAsset.transactions],
        })
      );
      trxHash = tx.hash;

      const clientInstance = isL0token ? metagraphClient.networkInstance : dag4.network;
      this.waitForDagTransaction(trxHash, activeAsset.transactions, clientInstance);
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
          `${utils.ETHChain}.${assets[activeAsset.id].symbol}-${
            assets[activeAsset.id].address
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
        nonce: newTx.nonce,
      });
    }
    this.tempTx = null;

    if (!trxHash) {
      throw new Error('Transaction hash was not set');
    }

    return trxHash;
  }

  async confirmContractTempTx(
    activeAsset: IAssetInfoState | IActiveAssetState
  ): Promise<string> {
    if (!dag4.account.isActive()) {
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
  isValidDAGAddress(address: string): boolean {
    return dag4.account.validateDagAddress(address);
  }

  async isValidMetagraphAddress(address: string, chainId?: string): Promise<boolean> {
    if (!dag4.account.validateDagAddress(address)) return false;

    const { activeNetwork }: IVaultState = store.getState().vault;
    const activeChain = chainId || activeNetwork[KeyringNetwork.Constellation];
    // We should validate the metagraph address only on Mainnet
    if (activeChain !== DAG_NETWORK.main2.id) {
      return true;
    }
    const BE_URL = DAG_NETWORK[activeChain].config.beUrl;
    const response: any = await (
      await fetch(`${BE_URL}/currency/${address}/snapshots/latest`)
    ).json();
    return !!response?.data?.hash;
  }

  async isValidNode(url: string): Promise<boolean> {
    let response;

    try {
      response = await (await fetch(`${url}/cluster/info`)).json();
    } catch (err) {
      return false;
    }

    return !!response?.length && !!response[0]?.id;
  }

  isValidERC20Address(address: string): boolean {
    if (!this.networkController) {
      return false;
    }
    return this.networkController?.validateAddress(address);
  }

  async fetchCustomToken(address: string, chainId: string): Promise<void> {
    let info = null;
    try {
      info = await this.networkController.getTokenInfo(address, chainId);
    } catch (err) {
      console.log('Error: Unable to fetch token info');
    }
    if (info) {
      store.dispatch(
        setCustomAsset({
          tokenAddress: info.address || '',
          tokenName: info.name || '',
          tokenSymbol: info.symbol || '',
          tokenDecimals: info.decimals?.toString() || '',
        })
      );
    }
  }

  async getRecommendFee(): Promise<number> {
    return await dag4.account.getFeeRecommendation();
  }

  async getLatestGasPrices(network?: string): Promise<number[]> {
    const gasPrices = await this.networkController.estimateGasPrices(network);
    const results = Object.values(gasPrices).map((gas) =>
      Math.round(Number(ethers.utils.formatUnits(gas.amount().toString(), 'gwei')))
    );
    return results;
  }

  async getFullETHTxs(): Promise<ITransactionInfo[]> {
    return this.txController.getFullTxs();
  }
}
