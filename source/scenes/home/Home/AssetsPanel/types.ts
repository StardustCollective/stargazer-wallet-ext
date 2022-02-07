import { IAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { INFTInfoState, INFTListState } from 'state/nfts/types';

export default interface IAssetPanel {
  activeNetworkAssets: IAssetState[];
  handleSelectAsset: (asset: IAssetState) => void;
  assets: IAssetListState;
  activeNFTAssets: IAssetState[];
  nfts: INFTListState;
  handleSelectNFT: (nft: INFTInfoState ) => void;
  activeWallet: IWalletState;
}