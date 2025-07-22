import { TransactionResponse } from '@ethersproject/abstract-provider';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringManager, KeyringNetwork, KeyringWalletAccountState, KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { GlobalDagNetwork, MetagraphTokenNetwork } from '@stardust-collective/dag4-network';
import { BigNumber, ethers } from 'ethers';

import { DAG_EXPLORER_API_URL, DAG_NETWORK } from 'constants/index';

import { SignTransactionDataDAG, SignTransactionDataEVM, TransactionType } from 'scenes/external/SignTransaction/types';

import { ProtocolProvider, StargazerChain } from 'scripts/common';

import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { setCustomAsset } from 'state/erc20assets';
import store from 'state/store';
import { changeActiveAsset, changeActiveWallet, setLoadingTransactions, setPublicKey, updateActiveWalletLabel, updateRewards, updateStatus, updateTransactions, updateWalletLabel } from 'state/vault';
import IVaultState, { ActiveNetwork, AssetType, IActiveAssetState, IAssetState, IWalletState, Reward } from 'state/vault/types';

import { isNative } from 'utils/envUtil';
import erc20 from 'utils/erc20.json';
import { getHardwareWalletPage, HardwareWalletType, isHardware, SupportedDagChains, SupportedEvmChains } from 'utils/hardware';
import { toDatum } from 'utils/number';

import { ExternalRoute } from 'web/pages/External/types';

import { ITransactionInfo } from '../../types';
import { updateAndNotify } from '../handlers/handleStoreSubscribe';
import { AssetsBalanceMonitor } from '../helpers/assetsBalanceMonitor';
import { StargazerExternalPopups } from '../messaging';
import { DappMessage, DappMessageEvent, MessageType } from '../messaging/types';

import { getChainId, getNetworkFromChainId, getNetworkIdFromChainId } from './EVMChainController/utils';
import AssetsController, { IAssetsController } from './AssetsController';
import { EthTransactionController } from './EthTransactionController';
import { utils } from './EVMChainController';
import NetworkController from './NetworkController';

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

  private buildAccountAssetList(walletInfo: KeyringWalletState, account: KeyringWalletAccountState): IAssetState[] {
    const { assets } = store.getState();

    let privateKey: string | undefined;
    let publicKey: string | undefined;

    // Excludes bitfi and ledger accounts since we do not have access
    // to the private key.
    if (!isHardware(walletInfo.type)) {
      privateKey = this.keyringManager.exportAccountPrivateKey(account.address);
    } else {
      publicKey = account.publicKey;
    }

    if (account.network === KeyringNetwork.Constellation) {
      if (privateKey) {
        dag4.account.loginPrivateKey(privateKey);
      } else if (publicKey) {
        dag4.account.loginPublicKey(publicKey);
      }

      const currentPublicKey = dag4.account?.keyTrio?.publicKey ?? null;

      if (currentPublicKey) {
        store.dispatch(setPublicKey(currentPublicKey));
      }

      const dagAsset = {
        id: AssetType.Constellation,
        type: walletInfo.type === KeyringWalletType.LedgerAccountWallet ? AssetType.LedgerConstellation : AssetType.Constellation,
        label: 'DAG',
        address: account.address,
      };

      const L0_TOKENS = Object.values(assets)
        .filter(token => token.type === AssetType.Constellation && !!token.l0endpoint)
        .map(token => token.id);

      const l0tokens = this.buildAccountL0Tokens(account.address, L0_TOKENS);

      return [dagAsset, ...l0tokens];
    }

    if (account.network === KeyringNetwork.Ethereum) {
      this.networkController = new NetworkController(privateKey);

      const ethAsset = {
        id: AssetType.Ethereum,
        type: AssetType.Ethereum,
        label: 'ETH',
        address: account.address,
      };

      const ERC_20_TOKENS = Object.values(assets)
        .filter(token => token.type === AssetType.ERC20)
        .map(token => token.id);

      // 349: New network should be added here.
      const NETWORK_TOKENS = Object.values(assets)
        .filter(token => [AssetType.Polygon, AssetType.Avalanche, AssetType.BSC, AssetType.Base].includes(token?.id as AssetType))
        .map(token => token.id);

      const networkAssets = this.buildNetworkAssets(account.address, NETWORK_TOKENS);

      const erc20Assets = this.buildAccountERC20Tokens(account.address, ERC_20_TOKENS);

      return [ethAsset, ...networkAssets, ...erc20Assets];
    }

    console.log('Unknown account network: cannot build asset list');
    return [];
  }

  private buildAccountL0Tokens(dagAddress: string, tokens: string[]): IAssetState[] {
    const { assets } = store.getState();

    if (!tokens?.length) return [];

    const assetList: IAssetState[] = tokens
      .filter(token => !!assets[token])
      .map(token => {
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
      label: 'AVAX',
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
      label: 'POL',
      address,
    };

    const baseAsset = {
      id: AssetType.Base,
      type: AssetType.Ethereum,
      label: 'Base ETH',
      address,
    };

    if (tokens.includes(baseAsset.id)) {
      networkAssets.push(baseAsset);
    }

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

  notifyAccountChange(account: KeyringWalletAccountState, walletInfo: KeyringWalletState) {
    const { whitelist } = store.getState().dapp;

    const network = account.network === KeyringNetwork.Constellation ? ProtocolProvider.CONSTELLATION : ProtocolProvider.ETHEREUM;

    for (const site of Object.keys(whitelist)) {
      const { origin } = whitelist[site];

      // This scenario is for only DAG/ETH wallets.
      // We should notify all connected dApps that the accounts array is now empty on the provider not used for this wallet.
      // Ex 1. Active wallet -> Only DAG -> Notify accountsChanged = [] on Ethereum's provider.
      // Ex 2. Active wallet -> Only ETH -> Notify accountsChanged = [] on Constellation's provider.
      if ([KeyringWalletType.SingleAccountWallet, KeyringWalletType.BitfiAccountWallet].includes(walletInfo.type)) {
        const otherNetwork = account.network === KeyringNetwork.Constellation ? ProtocolProvider.ETHEREUM : ProtocolProvider.CONSTELLATION;

        const emptyAccountsMessage: DappMessage = {
          type: MessageType.dapp,
          event: DappMessageEvent.accountsChanged,
          payload: {
            network: otherNetwork,
            accounts: [],
            origin,
          },
        };
        chrome.runtime.sendMessage(emptyAccountsMessage);
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
      chrome.runtime.sendMessage(message);
    }
  }

  buildAccountAssetInfo(walletId: string, walletLabel: string): void {
    const state = store.getState();
    const { vault } = state;
    const { local, ledger, bitfi, cypherock } = vault.wallets;
    const allWallets = [...local, ...ledger, ...bitfi, ...cypherock];
    const walletInfo: KeyringWalletState & {cypherockId?: string; bipIndex?: number} = allWallets.find((w: KeyringWalletState) => w.id === walletId || w.label === walletLabel);

    if (!walletInfo) {
      return;
    }

    let assetList: IAssetState[] = [];
    for (const account of walletInfo.accounts) {
      const accountAssetList = this.buildAccountAssetList(walletInfo, account);

      if (!isNative) {
        this.notifyAccountChange(account, walletInfo);
      }

      assetList = assetList.concat(accountAssetList);
    }

    const activeWallet: IWalletState = {
      id: walletInfo.id,
      type: walletInfo.type,
      label: walletInfo.label,
      supportedAssets: walletInfo.supportedAssets,
      assets: assetList,
      accounts: walletInfo.accounts,
      cypherockId: walletInfo.cypherockId,
    };

    // Ledger wallet will contain a bipIndex.
    if (walletInfo?.bipIndex !== undefined) {
      activeWallet.bipIndex = walletInfo.bipIndex;
    }

    store.dispatch(changeActiveWallet(activeWallet));
    updateAndNotify();
  }

  private buildAccountERC20Tokens(address: string, accountTokens: string[]) {
    const assetInfoMap: IAssetListState = store.getState().assets;

    const resolveTokens = accountTokens.map(add => {
      return assetInfoMap[add];
    });

    const tokens = resolveTokens.filter(token => !!token);

    const assetList: IAssetState[] = tokens.map(t => ({
      id: t.id,
      type: AssetType.ERC20,
      label: t.label,
      contractAddress: t.address,
      address,
    }));

    return assetList;
  }

  async getMetagraphRewards(network: string, walletAddress: string, metagraphId: string): Promise<Reward[]> {
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

    if (activeAsset.type === AssetType.Constellation || activeAsset.type === AssetType.LedgerConstellation) {
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
          [txsV2, rewards] = await Promise.all([metagraphClient.getTransactions(TXS_LIMIT), this.getMetagraphRewards(assetInfo.network, activeAsset.address, assetInfo.address)]);
        } catch (err) {
          console.log('Error: getLatestTransactions', err);
          txsV2 = [];
          rewards = [];
        }
      } else {
        const { id } = dag4.network.getNetwork();

        try {
          [txsV2, rewards] = await Promise.all([dag4.monitor.getLatestTransactions(activeAsset.address, TXS_LIMIT), this.getDagRewards(id, activeAsset.address)]);
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
      const txs: any = await this.txController.getTransactionHistory(activeAsset.address, TXS_LIMIT);

      store.dispatch(updateTransactions({ txs: txs.transactions }));
    } else if (activeAsset.type === AssetType.ERC20) {
      const txs: any = await this.txController.getTokenTransactionHistory(activeAsset.address, assets[activeAsset.id], TXS_LIMIT);

      store.dispatch(updateTransactions({ txs: txs.transactions }));
    }

    store.dispatch(setLoadingTransactions(false));
  }

  updateWalletLabel(wallet: KeyringWalletState, label: string): void {
    if (!isHardware(wallet.type)) {
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

  async waitForDagTransaction(txHash: string, oldTransactions: any[], networkInstance: MetagraphTokenNetwork | GlobalDagNetwork): Promise<void> {
    const ATTEMPTS = 4;
    const WAITING_TIME = 20000; // 20 seconds

    let pendingTx = await networkInstance.getPendingTransaction(txHash);

    while (pendingTx !== null) {
      // Wait for 5 seconds before the next check
      await new Promise(resolve => setTimeout(resolve, 5000));

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
        }
        if (attempt < ATTEMPTS) {
          // If the transaction isn't confirmed and it's not the last attempt, wait for 20 seconds
          await new Promise(resolve => setTimeout(resolve, WAITING_TIME));
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

  async signHardwareTransaction(): Promise<void> {
    const { activeAsset, activeNetwork, activeWallet }: IVaultState = store.getState().vault;
    const { assets } = store.getState();
    const assetInfo = assets[activeAsset.id];

    const windowUrl = getHardwareWalletPage(activeWallet.type);
    let data: SignTransactionDataDAG | SignTransactionDataEVM;
    let chain: StargazerChain;
    let activeChainId: number;

    const from = this.tempTx.fromAddress;
    const to = this.tempTx.toAddress;
    const { amount } = this.tempTx;
    const { fee } = this.tempTx;

    if (activeAsset.type === AssetType.Constellation) {
      const { chainId } = DAG_NETWORK[activeNetwork.Constellation];

      const transactionType = activeAsset.id === AssetType.Constellation ? TransactionType.DagNative : TransactionType.DagMetagraph;

      activeChainId = chainId;
      chain = StargazerChain.CONSTELLATION;

      if (!SupportedDagChains[activeWallet.type as HardwareWalletType].includes(chainId)) {
        throw new Error('Chain not supported by the hardware wallet');
      }

      const metagraphObject =
        activeAsset.id === AssetType.Constellation
          ? {}
          : {
              metagraphAddress: assetInfo.address,
            };

      data = {
        type: transactionType,
        ...metagraphObject,
        transaction: {
          from,
          to,
          value: toDatum(amount),
          fee: toDatum(fee) ?? 0,
        },
      } as SignTransactionDataDAG;
    } else {
      const network = getNetworkFromChainId(assetInfo.network);
      const activeChain = activeNetwork[network as keyof ActiveNetwork];
      chain = getNetworkIdFromChainId(assetInfo.network) as StargazerChain;
      activeChainId = getChainId(activeChain);

      if (!SupportedEvmChains[activeWallet.type as HardwareWalletType].includes(activeChainId)) {
        throw new Error('Chain not supported by the hardware wallet');
      }

      if (activeAsset.type === AssetType.Ethereum) {
        data = {
          type: TransactionType.EvmNative,
          transaction: {
            chainId: activeChainId,

            from,
            to,
            value: ethers.utils.parseEther(amount)._hex,
          },
        };
      }

      if (activeAsset.type === AssetType.ERC20) {
        const contractAddress = assetInfo.address;

        const iface = new ethers.utils.Interface(erc20);
        const value = ethers.utils.parseUnits(amount, assetInfo.decimals).toNumber();
        const hexData = iface.encodeFunctionData('transfer', [to, value]);

        data = {
          type: TransactionType.Erc20Transfer,
          transaction: {
            chainId: activeChainId,

            from,
            to: contractAddress,
            data: hexData,
          },
        };
      }
    }

    await StargazerExternalPopups.executePopup({
      params: {
        data,
        origin: 'stargazer-wallet',
        route: ExternalRoute.SignTransaction,
        wallet: {
          chain,
          chainId: activeChainId,
          address: from,
        },
      },
      url: windowUrl,
    });
  }

  async confirmTempTx(): Promise<void> {
    if (!dag4.account.isActive()) {
      throw new Error('Error: No signed account exists');
    }

    const { activeAsset, activeNetwork, activeWallet }: IVaultState = store.getState().vault;
    const { assets } = store.getState();

    if (!activeAsset) {
      throw new Error("Error: Can't find active account info");
    }

    if (!activeWallet) {
      throw new Error("Error: Can't find active wallet info");
    }

    if (!this.tempTx) {
      throw new Error("Error: Can't find transaction info");
    }

    if (isHardware(activeWallet.type)) {
      await this.signHardwareTransaction();
      return;
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

        pendingTx = await metagraphClient.transfer(this.tempTx.toAddress, Number(this.tempTx.amount), this.tempTx.fee);
      } else {
        pendingTx = await dag4.account.transferDag(this.tempTx.toAddress, Number(this.tempTx.amount), this.tempTx.fee);
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
        amount: utils.baseAmount(ethers.utils.parseUnits(this.tempTx.amount.toString(), assets[activeAsset.id].decimals).toString(), assets[activeAsset.id].decimals),
        gasPrice: gasPrice ? utils.baseAmount(ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(), 9) : undefined,
        gasLimit: gasLimit && BigNumber.from(gasLimit),
        nonce,
      };
      // TODO-349: Check how this works for ERC-20 tokens in Polygon, Avalanche, etc.
      if (activeAsset.type !== AssetType.Ethereum) {
        txOptions.asset = utils.assetFromString(`${utils.ETHChain}.${assets[activeAsset.id].symbol}-${assets[activeAsset.id].address}`);
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
  }

  async confirmContractTempTx(activeAsset: IAssetInfoState | IActiveAssetState): Promise<string> {
    const activeWalletType = store.getState().vault?.activeWallet?.type;
    if (activeWalletType && isHardware(activeWalletType)) {
      throw new Error('Hardware wallet contract transaction flow not implemented here. Please use device to confirm.');
    }

    if (!this.networkController) {
      throw new Error('Error: NetworkController not initialized. Cannot confirm EVM contract transaction.');
    }

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

    const baseAmountGasPrice = utils.baseAmount(ethers.utils.parseUnits(gasPrice.toString(), 'gwei').toString(), 9);
    const bigNumberGasPrice = BigNumber.from(baseAmountGasPrice.amount().toFixed());
    const { chainId, id: networkId } = this.networkController.getNetwork();

    const amount = this.tempTx.isTransfer ? '0' : this.tempTx.amount;

    const txOptions: any = {
      to: this.tempTx.toAddress,
      value: ethers.utils.parseEther(amount),
      gasPrice: bigNumberGasPrice,
      gasLimit: ethers.utils.hexlify(gasLimit),
      data: memo,
      chainId,
      nonce,
    };

    const wallet = this.networkController.getWallet();
    if (!wallet) {
      throw new Error('Unable to get wallet for sending transaction.');
    }
    const txData = await wallet.sendTransaction(txOptions);

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
    const response: any = await (await fetch(`${BE_URL}/currency/${address}/snapshots/latest`)).json();
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
    const results = Object.values(gasPrices).map(gas => Number(ethers.utils.formatUnits(gas.amount().toString(), 'gwei')));
    return results;
  }

  async getFullETHTxs(): Promise<ITransactionInfo[]> {
    return this.txController.getFullTxs();
  }
}
