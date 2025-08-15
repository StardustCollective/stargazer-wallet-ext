import { Transaction } from 'state/vault/types';

export type RenderIconProps = {
  tx: Transaction;
  isETH: boolean;
  isReceived: boolean;
  isRewardsTab?: boolean;
  isStakingTransaction?: boolean;
};

export type ITxItem = {
  tx: Transaction;
  isReceived: boolean;
  isETH: boolean;
  isSelf: boolean;
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
  title: string;
  formattedDistanceDate: string;
  renderGasSettings: () => JSX.Element;
}
