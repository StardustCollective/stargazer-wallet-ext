import { ISearchCurrency, ICurrencyRate, ICurrencyNetwork } from 'state/swap/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ISwapTokens {
  selectedCurrencySwapFrom: ISearchCurrency;
  selectedCurrencySwapTo: ISearchCurrency;
  selectedNetworkSwapFrom: ICurrencyNetwork;
  selectedNetworkSwapTo: ICurrencyNetwork;
  onNextPressed: () => void;
  onSwapFromTokenListPressed: () => void;
  onSwapToTokenListPressed: () => void;
  fromBalance: string;
  onFromChangeText: (text: string) => void;
  isBalanceError: boolean;
  isNextButtonDisabled: boolean;
  isRateError: boolean;
  isCurrencyRateLoading: boolean;
  currencyRate: ICurrencyRate;
  toAmount: number;
  isNextButtonLoading: boolean;
}
