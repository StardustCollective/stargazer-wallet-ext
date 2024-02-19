import { ITransactionInfo } from 'scripts/types';
import { IAssetInfoState } from 'state/assets/types';
import { IWalletState } from 'state/vault/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ITransferInfo {
  tempTx: ITransactionInfo;
  assetInfo: IAssetInfoState;
  activeWallet: IWalletState;
  feeUnit: string;
  transactionId: string;
  isSwapButtonLoading: boolean;
  getSendAmount: () => string;
  getFeeAmount: () => number;
  getTotalAmount: () => string;
  onSwapPressed: () => void;
  onCancelPressed: () => void;
}
