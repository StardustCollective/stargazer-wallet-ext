import { IAssetInfoState } from 'state/assets/types';
import { IAssetState, Transaction } from 'state/vault/types';

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
  renderTxItem: (transaction: Transaction, index: number) => void;
  transactionDescription: string;
}
