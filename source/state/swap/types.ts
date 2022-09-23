export interface ICurrencyNetwork {
  network: string;
  name: string;
  shortName: string;
  notes: string;
  addressRegex: string;
  isDefault: boolean;
  blackExplorer: string;
  depositMinAmount: number | null;
  memoNeeded: boolean;
  memoName: string;
  memRegex: string;
  precision: number;
}

export interface ISearchCurrency {
  code: string;
  name: string;
  icon: string;
  notes: string;
  networks: ICurrencyNetwork[];
}

export interface ISearchResponse {
  data: ISearchCurrency[];
  count: number;
}

export interface ISelectedCurrency {
  currency: ISearchCurrency,
  network: ICurrencyNetwork
}

export default interface ISwappingState {
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
};



