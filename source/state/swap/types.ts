export interface ICurrencyRateParams {
  coinFromCode: string;
  coinToNetwork: string;
  coinToCode: string;
  coinFromNetwork: string;
  amount: number;
}

export enum SupportedExolixSwapNetworks {
  AVALANCHE = 'AVAXC',
  BINANCE_SMART_CHAIN = 'BSC',
  ETHEREUM = 'ETH',
  POLYGON = 'MATIC',
  CONSTELLATION = 'DAG',
}

export enum ExolixTransactionStatuses {
  WAIT = 'wait',
  CONFIRMATION = 'confirmation',
  EXCHANGING = 'exchanging',
  SUCCESS = 'success',
  OVERDUE = 'overdue',
  REFUNDED = 'refunded',
}

export interface IExolixTransaction {
  id: string;
  amount: number;
  amountTo: number;
  coinFrom: {
    coinCode: string;
    coinName: string;
    network: string;
    networkName: string;
    networkShortName: string;
    icon: string;
    memoName: string;
  };
  coinTo: {
    coinCode: string;
    coinName: string;
    network: string;
    networkName: string;
    networkShortName: string;
    icon: string;
    memoName: string;
  };
  comment: string;
  createdAt: string;
  depositAddress: string;
  depositExtraId: string | null;
  withdrawalAddress: string;
  withdrawalExtraId: string | null;
  refundAddress: string;
  refundExtraId: string | null;
  hashIn: {
    hash: string;
    link: string;
  };
  hashOut: {
    hash: string;
    link: string;
  };
  rate: number;
  rateType: string;
  affiliateToken: string | null;
  status: string;
}

export interface IStageTransaction {
  coinFrom: string;
  networkFrom: string;
  coinTo: string;
  networkTo: string;
  amount: number;
  withdrawalAddress: string;
  refundAddress: string;
}

export interface IPendingTransaction {
  id: string;
  amount: number; // Amount being sent
  amountTo: number; // Amount that will be received in exchange
  depositAddress: string;
  withdrawalAddress: string;
  refundAddress: string;
}

export interface ICurrencyRate {
  fromAmount: number;
  toAmount: number;
  rate: number;
  message?: string;
  minAmount: number;
  withdrawMin?: number;
}

export interface ICurrencyNetwork {
  network: string;
  name: string;
  shortName: string;
  notes?: string;
  addressRegex?: string;
  isDefault?: boolean;
  blackExplorer?: string;
  depositMinAmount: number | null;
  memoNeeded?: boolean;
  memoName?: string;
  memRegex?: string;
  precision?: number;
}

export interface ISearchCurrency {
  id?: string;
  code: string;
  name: string;
  icon: string;
  notes?: string;
  networks?: ICurrencyNetwork[];
}

export interface ISearchResponse {
  data: ISearchCurrency[];
  count: number;
}

export interface ISelectedCurrency {
  currency: ISearchCurrency;
  network: ICurrencyNetwork;
}

export default interface ISwapState {
  currencyData: ISearchCurrency[];
  loading: boolean;
  error: any;
  swapFrom: {
    currency: ISearchCurrency;
    network: ICurrencyNetwork;
  };
  swapTo: {
    currency: ISearchCurrency;
    network: ICurrencyNetwork;
  };
  supportedAssets: ISearchCurrency[];
  currencyRate: {
    loading: boolean;
    rate: ICurrencyRate;
  };
  pendingSwap: IPendingTransaction;
  txIds: string[];
  transactionHistory: IExolixTransaction[];
  selectedTransaction: IExolixTransaction;
}
