import { FC } from 'react';
import { Transaction } from 'state/vault/types';

export type ITxItem = {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isGasSettingsVisible: boolean;
  onItemClick: (hash: string) => void;
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
};

export default interface ITxItemSettings extends ITxItem {
  onSpeedUpClick: () => void;
  onGasPriceChanged: () => void;
  minGasPrice: number;
  receivedOrSentText: boolean;
  formattedDistanceDate: string;
  renderGasSettings: () => FC;
}
