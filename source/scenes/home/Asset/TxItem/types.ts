import { Transaction } from 'state/vault/types';

export type RenderIconProps = {
  tx: Transaction;
  isETH: boolean;
  isReceived: boolean;
  isRewardsTab?: boolean;
};

export type ITxItem = {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isRewardsTab?: boolean;
  isGasSettingsVisible: boolean;
  getLinkUrl: (hash: string) => string;
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
  logo?: string;
  rewardsCount?: number;
};

export default interface ITxItemSettings extends ITxItem {
  receivedOrSentText: string;
  formattedDistanceDate: string;
  renderGasSettings: () => JSX.Element;
}
