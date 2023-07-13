import { FC } from 'react';
import { Transaction } from 'state/vault/types';

export type RenderIconProps = {
  tx: Transaction;
  isETH: boolean;
};

export type ITxItem = {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isGasSettingsVisible: boolean;
  getLinkUrl: (hash: string) => string;
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
  isL0token: boolean;
};

export default interface ITxItemSettings extends ITxItem {
  onSpeedUpClick: () => void;
  onGasPriceChanged: () => void;
  minGasPrice: number;
  receivedOrSentText: string;
  formattedDistanceDate: string;
  renderGasSettings: () => FC;
}
