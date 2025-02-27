import {
  AVALANCHE_LOGO,
  BASE_LOGO,
  BSC_LOGO,
  CONSTELLATION_LOGO,
  ETHEREUM_LOGO,
  POLYGON_LOGO,
} from 'constants/index';

export const SEARCH_STRING = 'Search';
export const NO_COINS_FOUND = 'No coins found.';
export const NO_COINS_AVAILABLE = 'No coins available.';
export const PLEASE_ADD_FUNDS = 'Please add funds to your wallet.';

export const EXOLIX_TO_STARGAZER_NETWORK_MAP: {
  [key: string]: string;
} = {
  ETH: 'Ethereum',
  DAG: 'Constellation',
  MATIC: 'Polygon',
  AVAXC: 'Avalanche',
  BSC: 'BSC',
  BASE: 'Base',
};

export const EXOLIX_TO_STARGAZER_LOGO_MAP: {
  [key: string]: string;
} = {
  ETH: ETHEREUM_LOGO,
  DAG: CONSTELLATION_LOGO,
  MATIC: POLYGON_LOGO,
  AVAXC: AVALANCHE_LOGO,
  BSC: BSC_LOGO,
  BASE: BASE_LOGO,
};
