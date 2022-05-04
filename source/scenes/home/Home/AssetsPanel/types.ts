import { IAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { INFTListState } from 'state/nfts/types';

export interface IAssetsPanelContainer {
  showNFTs: boolean;
}

export default interface IAssetPanel {
  activeNetworkAssets: IAssetState[];
  handleSelectAsset: (asset: IAssetState) => void;
  assets: IAssetListState;
  activeNFTAssets: IAssetState[];
  nfts: INFTListState;
  activeWallet: IWalletState;
  showNFTs: boolean;
}
