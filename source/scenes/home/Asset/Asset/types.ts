import { ActiveNetwork, IActiveAssetState, IWalletState, Transaction } from 'state/vault/types';
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
  transactions: Transaction[];
  onSendClick: () => void;
  assets: IAssetListState;
  showQrCode?: boolean;
  setShowQrCode?: (isVisible: boolean) => void;
  isAddressCopied: boolean;
  copyAddress: (address: string) => void;
  showFiatAmount: boolean;
}
