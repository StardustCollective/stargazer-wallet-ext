import { IExolixTransaction } from 'state/swap/types';

export interface ISwapHistoryContainer {
  navigation: any;
  route: any;
}

export default interface ISwapHistory {
  transactionHistoryData: IExolixTransaction[];
  onTransactionCellPressed: (transaction: IExolixTransaction) => void;
  isLoading: boolean;
}
