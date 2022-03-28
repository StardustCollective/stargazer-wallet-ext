import { Transaction } from 'state/vault/types';

export type ITxsPanel = {
  address: string;
  transactions: Transaction[];
};

export type ITxItemSettings = {
  tx: Transaction;
  idx: number;
};

export default interface ITxPanelSettings {
  transactions: Transaction[];
  renderTxItem: (transaction: Transaction, index: number, onItemClick: (tx: string) => boolean) => void;
  transactionDescription: string;
  getTxLink: (txHash: string) => string;
}
