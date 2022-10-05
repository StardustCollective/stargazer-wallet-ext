
export enum SupportedExolixSwapNetworks {
  AVALANCHE = 'Avalanche',
  BINANCE_SMART_CHAIN = 'BNB Smart Chain (BEP20)',
  ETHEREUM = 'Ethereum (ERC20)',
  POLYGON = 'Polygon',
  CONSTELLATION = 'Constellation'
}

export interface IPendingTransaction {
  id: string,
  amount: number, // Amount being sent
  amountTo: number, // Amount that will be received in exchange
  depositAddress: string,
  withdrawalAddress: string,
  refundAddress: string,
}

export interface ICurrencyRate {
  fromAmount: number,
  toAmount: number,
  rate: number,
  message?: string,
  minAmount: number,
  withdrawMin?: number,
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
  balance?: string;
  networks?: ICurrencyNetwork[];
}

export interface ISearchResponse {
  data: ISearchCurrency[];
  count: number;
}

export interface ISelectedCurrency {
  currency: ISearchCurrency,
  network: ICurrencyNetwork
}

export default interface ISwapState {
  currencyData: ISearchCurrency[];
  loading: boolean;
  error: any;
  swapFrom: {
    currency: ISearchCurrency,
    network: ICurrencyNetwork
  },
  swapTo: {
    currency: ISearchCurrency,
    network: ICurrencyNetwork,
  },
  supportedAssets: ISearchCurrency[],
  currencyRate: {
    loading: boolean,
    rate: ICurrencyRate
  },
  pendingSwap: IPendingTransaction,
  txIds: string[];
};



