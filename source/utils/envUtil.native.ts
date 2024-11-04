import {
  STARGAZER_SWAPPING_BASE_URL_PROD as stargazerSwappingBaseUrlProd,
  STARGAZER_PROVIDERS_BASE_URL as stargazerProvidersBaseUrl,
  STARGAZER_PROVIDERS_BASE_URL_PROD as stargazerProvidersBaseUrlProd,
  STARGAZER_API_KEY as stargazerApiKey,
  QUICKNODE_ETHEREUM_MAINNET as quickNodeEthereumMainnet,
  QUICKNODE_ETHEREUM_SEPOLIA as quickNodeEthereumSepolia,
  QUICKNODE_POLYGON_MAINNET as quickNodePolygonMainnet,
  QUICKNODE_POLYGON_TESTNET as quickNodePolygonTestnet,
  QUICKNODE_BSC_MAINNET as quickNodeBSCMainnet,
  QUICKNODE_BSC_TESTNET as quickNodeBSCTestnet,
  QUICKNODE_AVALANCHE_MAINNET as quickNodeAvalancheMainnet,
  QUICKNODE_AVALANCHE_TESTNET as quickNodeAvalancheTestnet,
  ELPACA_KEY as elpacaKey,
  ELPACA_VALUE as elpacaValue,
  LATTICE_API_KEY as latticeKey,
  COINGECKO_API_KEY as coinGeckoApiKey,
} from '@env';

export const STARGAZER_SWAPPING_BASE_URL_PROD = stargazerSwappingBaseUrlProd;
export const STARGAZER_PROVIDERS_BASE_URL = stargazerProvidersBaseUrl;
export const STARGAZER_PROVIDERS_BASE_URL_PROD = stargazerProvidersBaseUrlProd;
export const STARGAZER_API_KEY = stargazerApiKey;
export const COINGECKO_API_KEY = coinGeckoApiKey;
export const QUICKNODE_ETHEREUM_MAINNET = quickNodeEthereumMainnet;
export const QUICKNODE_ETHEREUM_SEPOLIA = quickNodeEthereumSepolia;
export const QUICKNODE_POLYGON_MAINNET = quickNodePolygonMainnet;
export const QUICKNODE_POLYGON_TESTNET = quickNodePolygonTestnet;
export const QUICKNODE_BSC_MAINNET = quickNodeBSCMainnet;
export const QUICKNODE_BSC_TESTNET = quickNodeBSCTestnet;
export const QUICKNODE_AVALANCHE_MAINNET = quickNodeAvalancheMainnet;
export const QUICKNODE_AVALANCHE_TESTNET = quickNodeAvalancheTestnet;
export const ELPACA_KEY = elpacaKey;
export const ELPACA_VALUE = elpacaValue;
export const LATTICE_API_KEY = latticeKey;
export const isProd = __DEV__ !== true;
export const isNative = true;
