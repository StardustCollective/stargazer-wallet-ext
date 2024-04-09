import { Transaction } from 'state/vault/types';

export type ITxsPanel = {
  route: string;
};

export type ITxItemSettings = {
  tx: Transaction;
  idx: number;
};

export default interface ITxPanelSettings {
  transactions: Transaction[];
  renderTxItem: (transaction: Transaction, index: number) => JSX.Element;
  transactionDescription: string;
  loading: boolean;
}
