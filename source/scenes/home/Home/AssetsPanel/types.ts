import { IAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { IElpacaState } from 'state/user/types';

export default interface IAssetPanel {
  activeNetworkAssets: IAssetState[];
  showClaimCard: boolean;
  claimLoading: boolean;
  handleSelectAsset: (asset: IAssetState) => void;
  handleAddTokens: () => void;
  handleClaim: () => void;
  handleClose: () => void;
  handleLearnMore: () => void;
  assets: IAssetListState;
  activeWallet: IWalletState;
  elpaca: IElpacaState;
}
