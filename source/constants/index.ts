import { AvalancheChainId, AvalancheChainValue, BSCChainId, BSCChainValue, EthChainId, EthChainValue, PolygonChainId, PolygonChainValue } from 'scripts/Background/controllers/EVMChainController/types';
import { 
  isProd,
  isNative, 
  STARGAZER_PROVIDERS_BASE_URL, 
  STARGAZER_PROVIDERS_BASE_URL_PROD, 
  QUICKNODE_ETHEREUM_MAINNET,
  QUICKNODE_ETHEREUM_ROPSTEN,
  QUICKNODE_ETHEREUM_RINKEBY,
  QUICKNODE_AVALANCHE_MAINNET,
  QUICKNODE_AVALANCHE_TESTNET,
  QUICKNODE_BSC_MAINNET,
  QUICKNODE_BSC_TESTNET,
  QUICKNODE_POLYGON_MAINNET,
  QUICKNODE_POLYGON_TESTNET,
} from 'utils/envUtil';

export const STORE_PORT = 'STARGAZER';

export const DAG_NETWORK: {
  [networkId: string]: {
    id: string;
    label: string;
    beUrl: string;
    lbUrl: string;
  };
} = {
  main: {
    id: 'main',
    label: 'Mainnet 1.0',
    beUrl: 'https://block-explorer.constellationnetwork.io',
    lbUrl: 'https://proxy.constellationnetwork.io/api/node',
  },
  ceres: {
    id: 'ceres',
    label: 'Testnet 1.0',
    beUrl: 'https://api-be.exchanges.constellationnetwork.io',
    lbUrl: 'http://lb.exchanges.constellationnetwork.io:9000',
  },
};

export const ETH_NETWORK: {
  [networkId: string]: {
    id: EthChainId;
    value: EthChainValue;
    label: string;
    explorer: string;
    chainId: number;
    rpcEndpoint: string;
    explorerAPI: string;
  };
} = {
  mainnet: {
    id: 'mainnet',
    value: 'homestead',
    label: 'Mainnet',
    rpcEndpoint: QUICKNODE_ETHEREUM_MAINNET,
    explorer: 'https://etherscan.io/',
    explorerAPI: 'https://api.etherscan.io',
    chainId: 1,
  },
  ropsten: {
    id: 'ropsten',
    value: 'ropsten',
    label: 'Ropsten',
    rpcEndpoint: QUICKNODE_ETHEREUM_ROPSTEN,
    explorer: 'https://ropsten.etherscan.io/',
    explorerAPI: 'https://api-ropsten.etherscan.io',
    chainId: 3,
  },
  rinkeby: {
    id: 'rinkeby',
    value: 'rinkeby',
    label: 'Rinkeby',
    rpcEndpoint: QUICKNODE_ETHEREUM_RINKEBY,
    explorer: 'https://rinkeby.etherscan.io/',
    explorerAPI: 'https://api-rinkeby.etherscan.io',
    chainId: 4,
  },
};

export const AVALANCHE_NETWORK: {
  [networkId: string]: {
    id: AvalancheChainId;
    value: AvalancheChainValue;
    label: string;
    explorer: string;
    chainId: number;
    rpcEndpoint: string;
    explorerAPI: string;
  };
} = {
  ['avalanche-mainnet']: {
    id: 'avalanche-mainnet',
    value: 'avalanche-mainnet',
    label: 'Avalanche C-Chain',
    rpcEndpoint: QUICKNODE_AVALANCHE_MAINNET,
    explorer: 'https://snowtrace.io/',
    explorerAPI: 'https://api.snowtrace.io',
    chainId: 43114,
  },
  ['avalanche-testnet']: {
    id: 'avalanche-testnet',
    value: 'avalanche-testnet',
    label: 'Fuji Testnet',
    rpcEndpoint: QUICKNODE_AVALANCHE_TESTNET,
    explorer: 'https://testnet.snowtrace.io/',
    explorerAPI: 'https://api-testnet.snowtrace.io',
    chainId: 43113,
  },
};

export const BSC_NETWORK: {
  [networkId: string]: {
    id: BSCChainId;
    value: BSCChainValue;
    label: string;
    explorer: string;
    chainId: number;
    rpcEndpoint: string;
    explorerAPI: string;
  };
} = {
  bsc: {
    id: 'bsc',
    value: 'bsc',
    label: 'Binance Smart Chain Mainnet',
    rpcEndpoint: QUICKNODE_BSC_MAINNET,
    explorer: 'https://bscscan.com/',
    explorerAPI: 'https://api.bscscan.com',
    chainId: 56,
  },
  ['bsc-testnet']: {
    id: 'bsc-testnet',
    value: 'bsc-testnet',
    label: 'Testnet',
    rpcEndpoint: QUICKNODE_BSC_TESTNET,
    explorer: 'https://testnet.bscscan.com/',
    explorerAPI: 'https://api-testnet.bscscan.com',
    chainId: 97,
  },
};

export const POLYGON_NETWORK: {
  [networkId: string]: {
    id: PolygonChainId;
    value: PolygonChainValue;
    label: string;
    explorer: string;
    chainId: number;
    rpcEndpoint: string;
    explorerAPI: string;
  };
} = {
  matic: {
    id: 'matic',
    value: 'matic',
    label: 'Mainnet',
    rpcEndpoint: QUICKNODE_POLYGON_MAINNET,
    explorer: 'https://polygonscan.com/',
    explorerAPI: 'https://api.polygonscan.com',
    chainId: 137,
  },
  maticmum: {
    id: 'maticmum',
    value: 'maticmum',
    label: 'Maticmum Testnet',
    rpcEndpoint: QUICKNODE_POLYGON_TESTNET,
    explorer: 'https://mumbai.polygonscan.com/',
    explorerAPI: 'https://api-testnet.polygonscan.com',
    chainId: 80001,
  },
};

// TODO-349: Include all networks
export const ALL_EVM_CHAINS = {
  ...ETH_NETWORK,
  ...AVALANCHE_NETWORK,
  ...BSC_NETWORK,
  ...POLYGON_NETWORK
};

export const ASSET_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price';
export const TOKEN_INFO_API =
  'https://api.coingecko.com/api/v3/coins/ethereum/contract/';
export const ERC20_TOKENS_API =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem';
export const ERC20_TOKENS_WITH_ADDRESS_API =
  'https://api.coingecko.com/api/v3/coins/list?include_platform=true';
export const SEARCH_API =
  'https://api.coingecko.com/api/v3/search?query=';
export const NFT_MAINNET_API = 'https://api.opensea.io/api/v1/';
export const NFT_TESTNET_API = 'https://testnets-api.opensea.io/api/v1/';
export const DAG_EXPLORER_SEARCH = 'https://www.dagexplorer.io/search?term=';

export const PRICE_DAG_ID = 'constellation-labs';
export const PRICE_BTC_ID = 'bitcoin';
export const PRICE_ETH_ID = 'ethereum';

export const LATTICE_ASSET = '0xa393473d64d2F9F026B60b6Df7859A689715d092';

export const ETH_PREFIX = '0X-';

export const DEFAULT_CURRENCY = {
  id: 'usd',
  symbol: '$',
  name: 'USD',
};

export const BUY_DAG_URL = 'https://howtobuydag.com/';
const PROVIDERS_BASE_URL = isProd ? STARGAZER_PROVIDERS_BASE_URL_PROD : STARGAZER_PROVIDERS_BASE_URL;

export const GET_QUOTE_API = `${PROVIDERS_BASE_URL}/quote`;
export const PAYMENT_REQUEST_API = `${PROVIDERS_BASE_URL}/payment-request`;
export const GET_SUPPORTED_ASSETS_API = `${PROVIDERS_BASE_URL}/v2/supported-assets`;
const SIMPLEX_FORM_BASE_URL = 'https://stargazer-assets.s3.us-east-2.amazonaws.com';
const SIMPLEX_FORM_SUBMISSION_URL_WEB = isProd ? `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.web.html?payment_id=` : `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.web.staging.html?payment_id=`;
const SIMPLEX_FORM_SUBMISSION_URL_NATIVE = isProd ? `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.html?payment_id=` : `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.staging.html?payment_id=`;
export const SIMPLEX_FORM_SUBMISSION_URL = isNative ? SIMPLEX_FORM_SUBMISSION_URL_NATIVE : SIMPLEX_FORM_SUBMISSION_URL_WEB;