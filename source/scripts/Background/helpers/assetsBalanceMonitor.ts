import { AccountTracker } from '@stardust-collective/dag4-xchain-ethereum';
import store from '../../../state/store';
import { updateBalances } from '../../../state/vault';
import IVaultState, { AssetType, IWalletState } from '../../../state/vault/types';
import IAssetListState from '../../../state/assets/types';
import { dag4 } from '@stardust-collective/dag4';

const FIFTEEN_SECONDS = 15 * 1000;
const ONE_MINUTE = 60 * 1000;

export class AssetsBalanceMonitor {

  private priceIntervalId: any;
  private dagBalIntervalId: any;
  private firstRunDagBalance: (obj: object) => void;
  private firstRunEthBalance: (obj: object) => void;

  private ethAccountTracker = new AccountTracker({infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' }});

  constructor () {}

  start () {

    const {activeWallet, activeNetwork}: IVaultState = store.getState().vault;

    if (activeWallet) {

      const p1 = new Promise<object>(resolve => this.firstRunDagBalance = resolve);
      const p2 = new Promise<object>(resolve => this.firstRunEthBalance = resolve);

      //On startup, update all balances at the same time
      Promise.all([p1,p2]).then(results => {

        const [dBal, eBal] = results;

        const { balances } = store.getState().vault;
        store.dispatch(updateBalances({ ...balances, ...dBal, ...eBal }));

        this.firstRunEthBalance = null;
        this.firstRunDagBalance = null;
      })

      dag4.monitor.startMonitor();

      this.startEthMonitor(activeWallet, activeNetwork);

      if (this.priceIntervalId) {
        clearInterval(this.priceIntervalId);
      }

      window.controller.stateUpdater();
      this.priceIntervalId = setInterval(window.controller.stateUpdater, 3 * ONE_MINUTE);

      if (this.dagBalIntervalId) {
        clearInterval(this.dagBalIntervalId);
      }

      this.refreshDagBalance();
      this.dagBalIntervalId = setInterval(() => this.refreshDagBalance(), FIFTEEN_SECONDS);
    }
  }

  stop () {
    clearInterval(this.priceIntervalId);
    clearInterval(this.dagBalIntervalId);
    this.priceIntervalId = null;
    this.dagBalIntervalId = null;
    this.ethAccountTracker.config(null, null, null, null);
  }

  async refreshDagBalance () {
    const bal = await dag4.account.getBalance();

    if (this.firstRunDagBalance) {
      this.firstRunDagBalance({ [AssetType.Constellation]: bal });
    }
    else {
      const { balances } = store.getState().vault;
      store.dispatch(updateBalances({ ...balances, [AssetType.Constellation]: bal }));
    }
  }

  private startEthMonitor(activeWallet: IWalletState, activeNetwork: { [p: string]: string }) {
    const assets: IAssetListState = store.getState().assets;
    const chainId = activeNetwork[AssetType.Ethereum] === 'mainnet' ? 1 : 3;
    const tokens = activeWallet.assets.filter(a => a.type === AssetType.ERC20).map(a => {
      const { address, decimals } = assets[a.id];
      return { contractAddress: address, decimals };
    });
    const ethAsset = activeWallet.assets.find(a => a.type === AssetType.Ethereum);

    this.ethAccountTracker.config(ethAsset.address, tokens, chainId, (ethBalance, tokenBals) => {
      const { balances } = store.getState().vault;
      if (this.firstRunEthBalance) {
        this.firstRunEthBalance({ [AssetType.Ethereum]: ethBalance, ...tokenBals });
      }
      else {
        store.dispatch(updateBalances({ ...balances, [AssetType.Ethereum]: ethBalance, ...tokenBals }));
      }
    }, 10);
  }

}
