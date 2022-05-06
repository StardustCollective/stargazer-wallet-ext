import { IActiveAssetState, IWalletState } from 'state/vault/types';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';
import IAssetListState from 'state/assets/types';

export type IAssetDetail = {
  navigation: any;
};

export default interface IAssetSettings {
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  balanceText: string;
  fiatAmount: string;
  transactions: DAGTransaction[];
  onSendClick: () => void;
  assets: IAssetListState;
  showQrCode?: boolean;
  setShowQrCode?: (isVisible: boolean) => void;
  isAddressCopied: boolean;
  copyAddress: (address: string) => void;
}
