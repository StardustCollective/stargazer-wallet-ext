import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DagWalletMonitorUpdate } from '@stardust-collective/dag4-wallet';
import { Subscription } from 'rxjs';
import { getAccountController } from 'utils/controllersUtils';
import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';
import { resetBalances, updateBalances } from 'state/vault';
import { setLoadingDAGBalances, setLoadingETHBalances } from 'state/flags';
import IVaultState, { AssetType } from 'state/vault/types';
import ControllerUtils from '../controllers/ControllerUtils';
import { AccountTracker } from '../controllers/EVMChainController';
import { getAllEVMChains } from '../controllers/EVMChainController/utils';
import { toDag } from 'utils/number';
import { DAG_NETWORK } from 'constants/index';
import { getDagAddress, walletHasDag, walletHasEth } from 'utils/wallet';
import { getElPacaInfo } from 'state/user/api';

const THIRTY_SECONDS = 30 * 1000;
const SIXTY_SECONDS = 60 * 1000;

export type AccountTrackerList = {
  [network: string]: AccountTracker;
};

export class AssetsBalanceMonitor {
  private priceIntervalId: any;

  private dagBalIntervalId: any;

  private pacaIntervalId: any;

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
    };
  }

  startPacaInterval() {
    if (this.pacaIntervalId) {
      clearInterval(this.pacaIntervalId);
    }

    this.pacaIntervalId = setInterval(() => this.refreshPacaStreak(), SIXTY_SECONDS);
    this.refreshPacaStreak();
  }

  startDagInterval() {
    this.subscription = dag4.monitor
      .observeMemPoolChange()
      .subscribe((up) => this.pollPendingTxs(up));

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
        this.stopPacaInterval();
      }

      if (!this.priceIntervalId) {
        this.startPriceInterval();
      }

      if (hasDAG) {
        this.startDagInterval();
        this.startPacaInterval();
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

  stopPacaInterval() {
    clearInterval(this.pacaIntervalId);
    this.pacaIntervalId = null;
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
    Object.values(this.accountTrackerList).forEach((tracker) => {
      tracker.stop();
    });
  }

  stop() {
    this.stopPriceInterval();
    this.stopDagInterval();
    this.stopPacaInterval();
    this.stopEthInterval();
  }

  private async pollPendingTxs(update: DagWalletMonitorUpdate) {
    if (update.pendingHasConfirmed) {
      getAccountController().getLatestTxUpdate();
    }
  }

  private async getCurrencyAddressBlockExplorerBalance(
    metagraphAddress: string,
    dagAddress: string
  ): Promise<string> {
    try {
      const balance =
        (
          (await dag4.network.blockExplorerV2Api.getCurrencyAddressBalance(
            metagraphAddress,
            dagAddress
          )) as any
        )?.data?.balance ?? 0;
      const balanceNumber = toDag(balance);

      return String(balanceNumber);
    } catch (err) {
      return null;
    }
  }

  private async getCurrencyAddressL0Balance(l0asset: IAssetInfoState): Promise<string> {
    try {
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: l0asset.address,
        id: l0asset.address,
        l0Url: l0asset.l0endpoint,
        l1Url: l0asset.l1endpoint,
        // Block explorer not available for local development
        beUrl: '',
      });

      const balanceNumber = await metagraphClient.getBalance();

      return String(balanceNumber);
    } catch (err) {
      return null;
    }
  }

  private async getAddressBlockExplorerBalance(address: string): Promise<string> {
    try {
      const balance: number =
        ((await dag4.network.blockExplorerV2Api.getAddressBalance(address)) as any)?.data
          ?.balance ?? 0;
      const balanceNumber = toDag(balance);

      return String(balanceNumber);
    } catch (err) {
      return null;
    }
  }

  async refreshL0balances(l0assets: IAssetInfoState[], dagAddress: string) {
    let l0balances: Record<string, string> = {};

    for (const l0asset of l0assets) {
      let balanceString;
      if (l0asset.network === DAG_NETWORK.local2.id) {
        // Get balance from L0 API for local development
        balanceString = await this.getCurrencyAddressL0Balance(l0asset);
      } else {
        balanceString = await this.getCurrencyAddressBlockExplorerBalance(
          l0asset.address,
          dagAddress
        );
      }
      if (!!balanceString) {
        l0balances[l0asset.id] = balanceString;
      }
    }

    return l0balances;
  }

  refreshPacaStreak() {
    const { elpaca } = store.getState().user;
    const { activeWallet } = store.getState().vault;
    const dagAddress = elpaca?.claim?.data?.address ?? getDagAddress(activeWallet);

    if (!dagAddress) return;

    store.dispatch<any>(getElPacaInfo(dagAddress));
  }

  async refreshDagBalance() {
    const { defaultTokens } = store.getState().providers;
    const { activeNetwork } = store.getState().vault;
    const { assets } = store.getState();

    const allAssets = !!defaultTokens?.data
      ? { ...defaultTokens.data, ...assets }
      : assets;

    try {
      // Hotfix: Use block explorer API directly.
      const { address } = dag4.account;

      const l0assets = Object.values(allAssets).filter(
        (asset) =>
          !!asset?.l0endpoint &&
          !!asset?.l1endpoint &&
          asset?.network === activeNetwork.Constellation
      );

      const l0balances = await this.refreshL0balances(l0assets, address);
      const balanceString = await this.getAddressBlockExplorerBalance(address);

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
    const defaultTokens = !!providers?.defaultTokens?.data
      ? Object.values(providers.defaultTokens.data)
      : [];
    const defaultTokensIds = !!defaultTokens?.length
      ? defaultTokens.map((token) => token.id)
      : [];

    const activeTokens = activeWallet.assets
      .map((a) => assets[a.id])
      .filter((a) => !defaultTokensIds.includes(a.id));
    const allTokens = [...defaultTokens, ...activeTokens];

    // Remove Constellation chain
    networksList.shift();
    chainsList.shift();

    const promises = chainsList.map(async (chainId, i) => {
      const networkId = networksList[i];
      const chainInfo = EVM_CHAINS[chainId];

      const chainTokens = allTokens
        .filter((token) => token.type === AssetType.ERC20 && token.network === chainId)
        .map((token) => {
          const { address, decimals, network } = token;
          return { contractAddress: address, decimals, chain: network };
        });

      const MainAssetType = this.getNetworkMainTokenType(networkId);
      const ethAsset = activeWallet.assets.find((a) => a.type === AssetType.Ethereum);

      if (!!ethAsset && !!chainInfo) {
        return this.accountTrackerList[networkId].config(
          ethAsset?.address,
          chainInfo.rpcEndpoint,
          chainTokens,
          chainInfo.chainId,
          async (mainAssetBalance, tokenBals) => {
            return new Promise((resolve) => {
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
      } else {
        console.log(`Error: Unable to configure ${networkId}`);
      }
    });

    await Promise.all(promises);
    store.dispatch(setLoadingETHBalances(false));
  }
}
