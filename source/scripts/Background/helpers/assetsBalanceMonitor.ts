import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DagWalletMonitorUpdate } from '@stardust-collective/dag4-wallet';
import { Subscription } from 'rxjs';

import { getCurrencyAddressBalance, getDagBalance } from 'dag4/block-explorer';
import { getMetagraphCurrencyBalance } from 'dag4/metagraph';

import { IAssetInfoState } from 'state/assets/types';
import { setLoadingDAGBalances, setLoadingETHBalances } from 'state/flags';
import store from 'state/store';
import { resetBalances, updateBalances } from 'state/vault';
import IVaultState, { AssetType } from 'state/vault/types';

import { getAccountController } from 'utils/controllersUtils';
import { walletHasDag, walletHasEth } from 'utils/wallet';

import { DAG_NETWORK } from '../../../constants';
import ControllerUtils from '../controllers/ControllerUtils';
import { AccountTracker } from '../controllers/EVMChainController';
import { getAllEVMChains } from '../controllers/EVMChainController/utils';

const THIRTY_SECONDS = 30 * 1000;

export type AccountTrackerList = {
  [network: string]: AccountTracker;
};

export class AssetsBalanceMonitor {
  private priceIntervalId: any;

  private dagBalIntervalId: any;

  private accountTrackerList: AccountTrackerList;

  private subscription: Subscription;

  private utils = ControllerUtils();

  constructor() {
    // 349: New network should be added here.
    this.accountTrackerList = {
      [KeyringNetwork.Ethereum]: new AccountTracker(),
      Polygon: new AccountTracker(),
      Avalanche: new AccountTracker(),
      BSC: new AccountTracker(),
      Base: new AccountTracker(),
    };
  }

  startDagInterval() {
    this.subscription = dag4.monitor.observeMemPoolChange().subscribe(up => this.pollPendingTxs(up));

    dag4.monitor.startMonitor();

    if (this.dagBalIntervalId) {
      clearInterval(this.dagBalIntervalId);
    }

    this.dagBalIntervalId = setInterval(() => this.refreshDagBalance(), THIRTY_SECONDS);
    this.refreshDagBalance();
  }

  startPriceInterval() {
    this.utils.updateFiat();

    this.priceIntervalId = setInterval(this.utils.updateFiat, THIRTY_SECONDS);
  }

  async start() {
    this.stop();

    store.dispatch(resetBalances());
    store.dispatch(setLoadingDAGBalances(true));
    store.dispatch(setLoadingETHBalances(true));
    try {
      const { activeWallet }: IVaultState = store.getState().vault;

      if (!activeWallet) return;

      const hasDAG = walletHasDag(activeWallet);
      const hasETH = walletHasEth(activeWallet);

      if (!hasETH) this.stopEthInterval();
      if (!hasDAG) {
        this.stopDagInterval();
      }

      if (!this.priceIntervalId) {
        this.startPriceInterval();
      }

      if (hasDAG) {
        this.startDagInterval();
      }

      if (hasETH) {
        await this.refreshETHBalance();
      }
    } catch (e) {
      console.log('start error:', e);
    }
  }

  stopPriceInterval() {
    clearInterval(this.priceIntervalId);
    this.priceIntervalId = null;
  }

  stopDagInterval() {
    clearInterval(this.dagBalIntervalId);
    this.dagBalIntervalId = null;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  stopEthInterval() {
    Object.values(this.accountTrackerList).forEach(tracker => {
      tracker.stop();
    });
  }

  stop() {
    this.stopPriceInterval();
    this.stopDagInterval();
    this.stopEthInterval();
  }

  private async pollPendingTxs(update: DagWalletMonitorUpdate) {
    if (update.pendingHasConfirmed) {
      getAccountController().getLatestTxUpdate();
    }
  }

  async refreshL0balances(l0assets: IAssetInfoState[], dagAddress: string) {
    const l0balances: Record<string, string> = {};

    // Create an array of promises for parallel execution
    const balancePromises = l0assets.map(async l0asset => {
      let balance;

      if (l0asset.network === DAG_NETWORK.local2.id) {
        // Get balance from L0 API for local development
        balance = await getMetagraphCurrencyBalance(l0asset);
      } else {
        try {
          balance = await getCurrencyAddressBalance(l0asset.address, dagAddress);
        } catch (err) {
          balance = await getMetagraphCurrencyBalance(l0asset);
        }
      }

      return { assetId: l0asset.id, balance };
    });

    // Fetch all balances in parallel
    const results = await Promise.all(balancePromises);

    // Build the l0balances object from results
    results.forEach(({ assetId, balance }) => {
      if (balance !== undefined && balance !== null) {
        l0balances[assetId] = String(balance);
      }
    });

    return l0balances;
  }

  async refreshDagBalance() {
    const { defaultTokens } = store.getState().providers;
    const { activeNetwork } = store.getState().vault;
    const { assets } = store.getState();

    const allAssets = defaultTokens?.data ? { ...defaultTokens.data, ...assets } : assets;

    try {
      // Hotfix: Use block explorer API directly.
      const { address } = dag4.account;

      const l0assets = Object.values(allAssets).filter(
        asset => !!asset?.l0endpoint && !!asset?.l1endpoint && asset?.network === activeNetwork.Constellation
      );

      const l0balances = await this.refreshL0balances(l0assets, address);
      const balance = await getDagBalance(address);
      const balanceString = String(balance);

      store.dispatch(
        updateBalances({
          ...l0balances,
          ...(!!balanceString && { [AssetType.Constellation]: balanceString }),
        })
      );
      store.dispatch(setLoadingDAGBalances(false));
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log(e);
      }
    }
  }

  // TODO-349: Check if this util is fine here
  private getNetworkMainTokenType(networkId: string) {
    switch (networkId) {
      case KeyringNetwork.Constellation:
        return AssetType.Constellation;
      case KeyringNetwork.Ethereum:
        return AssetType.Ethereum;
      case 'Avalanche':
        return AssetType.Avalanche;
      case 'BSC':
        return AssetType.BSC;
      case 'Polygon':
        return AssetType.Polygon;
      case 'Base':
        return AssetType.Base;

      default:
        return AssetType.Constellation;
    }
  }

  async refreshETHBalance() {
    const { activeWallet, activeNetwork }: IVaultState = store.getState().vault;
    const { assets, providers } = store.getState();
    const networksList = Object.keys(activeNetwork);
    const chainsList = Object.values(activeNetwork);
    const EVM_CHAINS = getAllEVMChains();
    const defaultTokens = providers?.defaultTokens?.data ? Object.values(providers.defaultTokens.data) : [];
    const defaultTokensIds = defaultTokens?.length ? defaultTokens.map(token => token.id) : [];

    const activeTokens = activeWallet.assets.map(a => assets[a.id]).filter(a => !defaultTokensIds.includes(a.id));
    const allTokens = [...defaultTokens, ...activeTokens];

    // Remove Constellation chain
    networksList.shift();
    chainsList.shift();

    const promises = chainsList.map(async (chainId, i) => {
      const networkId = networksList[i];
      const chainInfo = EVM_CHAINS[chainId];

      const chainTokens = allTokens
        .filter(token => token.type === AssetType.ERC20 && token.network === chainId)
        .map(token => {
          const { address, decimals, network } = token;
          return { contractAddress: address, decimals, chain: network };
        });

      const MainAssetType = this.getNetworkMainTokenType(networkId);
      const ethAsset = activeWallet.assets.find(a => a.type === AssetType.Ethereum);

      if (!!ethAsset && !!chainInfo) {
        return this.accountTrackerList[networkId].config(
          ethAsset?.address,
          chainInfo.rpcEndpoint,
          chainTokens,
          chainInfo.chainId,
          async (mainAssetBalance, tokenBals) => {
            return new Promise(resolve => {
              store.dispatch(
                updateBalances({
                  ...(!!mainAssetBalance && { [MainAssetType]: mainAssetBalance }),
                  ...tokenBals,
                })
              );
              resolve();
            });
          },
          30
        );
      }
      console.log(`Error: Unable to configure ${networkId}`);
    });

    await Promise.all(promises);
    store.dispatch(setLoadingETHBalances(false));
  }
}
