import { ITransactionInfo } from 'scripts/types';
import { IAssetInfoState } from 'state/assets/types';
import { IActiveAssetState, IWalletState } from 'state/vault/types';

export interface ISendConfirm {
  confirmed: boolean;
  tempTx: ITransactionInfo;
  assetInfo: IAssetInfoState;
  activeAsset?: IAssetInfoState | IActiveAssetState;
  getSendAmount: () => any;
  activeWallet: IWalletState;
  feeUnit: string;
  getFeeAmount: () => any;
  getTotalAmount: () => any;
  handleCancel: () => void;
  handleConfirm: () => void;
  disabled: boolean;
  isL0token: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  getDagSmallFeeAmount: () => string;
}
