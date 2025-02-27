import { IAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

export default interface IAssetPanel {
  activeNetworkAssets: IAssetState[];
  showClaimCard: boolean;
  assets: IAssetListState;
  activeWallet: IWalletState;
  handleSelectAsset: (asset: IAssetState) => void;
  handleAddTokens: () => void;
  handleHideCard: () => void;
}
