import { ActiveNetwork, IActiveAssetState, IWalletState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

export type IAssetDetail = {
  navigation: any;
};

export default interface IAssetSettings {
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  activeNetwork: ActiveNetwork;
  balanceText: string;
  fiatAmount: string;
  assets: IAssetListState;
  showQrCode?: boolean;
  isAddressCopied: boolean;
  showFiatAmount: boolean;
  onSendClick: () => void;
  setShowQrCode?: (isVisible: boolean) => void;
  copyAddress: (address: string) => void;
}
