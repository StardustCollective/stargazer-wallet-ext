import { AccountTracker } from '@stardust-collective/dag4-xchain-ethereum';
import store from '../../../state/store';
import { updateBalances } from '../../../state/vault';
import IVaultState, { ActiveNetwork, AssetType, IWalletState } from '../../../state/vault/types';
import IAssetListState from '../../../state/assets/types';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DagWalletMonitorUpdate } from '@stardust-collective/dag4-wallet';
import { Subscription } from 'rxjs';

const FIFTEEN_SECONDS = 15 * 1000;
const ONE_MINUTE = 60 * 1000;

export class AssetsBalanceMonitor {

  private priceIntervalId: any;
  private dagBalIntervalId: any;

  private ethAccountTracker = new AccountTracker({infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' }});
  private subscription: Subscription;

  private hasDAGPending = false;
  private hasETHPending = false;

  constructor () {}

  start () {

    const {activeWallet, activeNetwork}: IVaultState = store.getState().vault;

    if (activeWallet) {

      let hasDAG = false, hasETH = false;

      activeWallet.assets.forEach(a => {
        hasDAG = hasDAG || a.type === AssetType.Constellation || a.type === AssetType.LedgerConstellation;
        hasETH = hasETH || a.type === AssetType.Ethereum || a.type === AssetType.ERC20;
      });

      // const promises = [];
      // let firstRunDagBalance: FirstRunCallback;
      // let firstRunEthBalance: FirstRunCallback;
      //
      // if (this.hasDAG) {
      //   const p = new Promise<object>(resolve => firstRunDagBalance = resolve);
      //   promises.push(p);
      // }
      //
      // if (this.hasETH) {
      //   const p = new Promise<object>(resolve => firstRunEthBalance = resolve);
      //   promises.push(p);
      // }
      //
      // //On startup, update all balances at the same time
      // Promise.all(promises).then(results => {
      //
      //   const [dBal, eBal] = results;
      //
      //   const { balances } = store.getState().vault;
      //   store.dispatch(updateBalances({ ...balances, ...dBal, ...eBal }));
      // })
      if (hasDAG) {
        this.subscription = dag4.monitor.observeMemPoolChange().subscribe((up) => this.pollPendingTxs(up));
        dag4.monitor.startMonitor();

        if (this.dagBalIntervalId) {
          clearInterval(this.dagBalIntervalId);
        }

        this.hasDAGPending = true;

        this.refreshDagBalance();
        this.dagBalIntervalId = setInterval(() => this.refreshDagBalance(), FIFTEEN_SECONDS);
      }

      if (hasETH) {
        this.hasETHPending = true;
        this.startEthMonitor(activeWallet, activeNetwork);
      }

      if (this.priceIntervalId) {
        clearInterval(this.priceIntervalId);
      }

      window.controller.stateUpdater();
      this.priceIntervalId = setInterval(window.controller.stateUpdater, 3 * ONE_MINUTE);
    }
  }

  stop () {
    clearInterval(this.priceIntervalId);
    clearInterval(this.dagBalIntervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.priceIntervalId = null;
    this.dagBalIntervalId = null;
    this.ethAccountTracker.config(null, null, null, null);
  }

  private async pollPendingTxs (update: DagWalletMonitorUpdate) {

    if (update.pendingHasConfirmed) {
      window.controller.wallet.account.getLatestTxUpdate();
    }
  }


  async refreshDagBalance () {
    const bal = await dag4.account.getBalance();

    this.hasDAGPending = false;

    const { balances } = store.getState().vault;
    const pending = this.hasETHPending ? 'true' : undefined
    store.dispatch(updateBalances({ ...balances, [AssetType.Constellation]: bal, pending }));
  }

  private startEthMonitor(activeWallet: IWalletState, activeNetwork: ActiveNetwork) {
    const assets: IAssetListState = store.getState().assets;
    const chainId = activeNetwork[KeyringNetwork.Ethereum] === 'mainnet' ? 1 : 3;
    const tokens = activeWallet.assets.filter(a => a.type === AssetType.ERC20).map(a => {
      const { address, decimals } = assets[a.id];
      return { contractAddress: address, decimals };
    });
    const ethAsset = activeWallet.assets.find(a => a.type === AssetType.Ethereum);

    this.ethAccountTracker.config(ethAsset.address, tokens, chainId, (ethBalance, tokenBals) => {
      const { balances } = store.getState().vault;
      const pending = this.hasDAGPending ? 'true' : undefined
      this.hasETHPending = false;
      store.dispatch(updateBalances({ ...balances, [AssetType.Ethereum]: ethBalance, ...tokenBals, pending }));
    }, 10);
  }

}
