import { AccountTracker } from '@stardust-collective/dag4-xchain-ethereum';
import store from '../../../state/store';
import { updateBalances } from '../../../state/vault';
import IVaultState, { AssetType, IWalletState } from '../../../state/vault/types';
import IAssetListState from '../../../state/assets/types';
import { dag4 } from '@stardust-collective/dag4';

export class AccountMonitor {

  private priceIntervalId: any;

  private ethAccountTracker = new AccountTracker({infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' }});

  constructor () {

  }

  start () {

    const {activeWallet, activeNetwork}: IVaultState = store.getState().vault;

    if (activeWallet) {
      dag4.monitor.startMonitor();

      this.startEthMonitor(activeWallet, activeNetwork);

      if (this.priceIntervalId) {
        clearInterval(this.priceIntervalId);
      }
      window.controller.stateUpdater();
      this.priceIntervalId = setInterval(window.controller.stateUpdater, 3 * 60 * 1000);
    }
  }

  stop () {
    clearInterval(this.priceIntervalId);
    this.priceIntervalId = null;
    this.ethAccountTracker.config(null, null, null, null);
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
      store.dispatch(updateBalances({ ...balances, [AssetType.Ethereum]: ethBalance, ...tokenBals }));
    }, 10);
  }

}
