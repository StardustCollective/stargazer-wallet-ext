import { IAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

export default interface IAssetPanel {
  activeNetworkAssets: IAssetState[];
  handleSelectAsset: (asset: IAssetState) => void;
  handleAddTokens: () => void;
  assets: IAssetListState;
  activeWallet: IWalletState;
}
