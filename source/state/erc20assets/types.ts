import { IAssetInfoState } from 'state/assets/types';

export interface ERC20Asset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: any;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: any;
  max_supply?: any;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface ERC20AssetWithAddress {
  id: string;
  symbol: string;
  name: string;
  platforms: any;
}

export interface SearchAsset {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}
export interface ICustomAssetForm {
  l0endpoint?: string;
  l1endpoint?: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
}

export default interface IERC20AssetsListState {
  loading: boolean;
  error: any;
  erc20assets: IAssetInfoState[];
  constellationAssets: IAssetInfoState[];
  searchAssets: IAssetInfoState[];
  customAssetForm: ICustomAssetForm;
}
