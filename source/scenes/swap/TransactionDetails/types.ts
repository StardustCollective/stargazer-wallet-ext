import { IExolixTransaction } from 'state/swap/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ITransferInfo {
  transaction: IExolixTransaction;
  onSupportLinkPress: () => void;
}
