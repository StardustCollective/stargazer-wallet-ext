
import { ISearchCurrency } from 'state/swap/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ISwapTokens {
  selectedCurrencySwapFrom: ISearchCurrency;
  selectedCurrencySwapTo: ISearchCurrency;
  onNextPressed: () => void;
  onSwapFromTokenListPressed: () => void;
  onSwapToTokenListPressed: () => void;
}
