import { ISearchCurrency, ICurrencyNetwork } from 'state/swap/types';
import { SWAP_ACTIONS } from 'scenes/swap/constants';
import { AssetBalances } from 'state/vault/types';

export interface ITokenListContainer {
  navigation: any;
  route: any;
}

export default interface ITokenList {
  onTokenCellPressed: (dataItem: ISearchCurrency, network: ICurrencyNetwork) => void;
  currencyData: ISearchCurrency[];
  onSearchChange: (value: string) => void;
  searchValue: string;
  isLoading: boolean;
  action: SWAP_ACTIONS;
  balances: AssetBalances;
}
