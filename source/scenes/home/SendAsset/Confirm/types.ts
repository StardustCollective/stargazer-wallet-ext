import { StargazerRequestMessage } from 'scripts/common';
import { ITransactionInfo } from 'scripts/types';
import { IAssetInfoState } from 'state/assets/types';
import { IActiveAssetState, IWalletState } from 'state/vault/types';

export interface ISendConfirm {
  isExternalRequest: boolean;
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
  handleConfirm: (
    callbackSuccess: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null,
    callbackError: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null
  ) => void;
  disabled: boolean;
  isL0token: boolean;
  isTransfer: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  getDagSmallFeeAmount: () => string;
}
