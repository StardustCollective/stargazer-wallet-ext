import { AvalancheChainId, AvalancheChainValue, BSCChainId, BSCChainValue, EthChainId, EthChainValue, PolygonChainId, PolygonChainValue } from 'scripts/Background/controllers/EVMChainController/types';
import { 
  isProd,
  isNative, 
  COINGECKO_API_KEY,
  STARGAZER_PROVIDERS_BASE_URL, 
  STARGAZER_PROVIDERS_BASE_URL_PROD, 
  QUICKNODE_ETHEREUM_MAINNET,
  QUICKNODE_ETHEREUM_GOERLI,
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
    version: string;
    testnet: boolean;
    explorer: string;
    config: {
      beUrl: string;  // 1.0 and 2.0
      lbUrl?: string; // 1.0
      l0Url?: string; // 2.0
      l1Url?: string; // 2.0
    };
  };
} = {
  main2: {
    id: 'main2',
    label: 'Mainnet 2.0',
    version: '2.0',
    testnet: false,
    explorer: 'https://mainnet.dagexplorer.io',
    config: {
      beUrl: 'https://be-mainnet.constellationnetwork.io',
      l0Url: 'https://l0-lb-mainnet.constellationnetwork.io',
      l1Url: 'https://l1-lb-mainnet.constellationnetwork.io'
    }
  },
  test2: {
    id: 'test2',
    label: 'Testnet 2.0',
    version: '2.0',
    testnet: true,
    explorer: 'https://testnet.dagexplorer.io',
    config: {
      beUrl: 'https://be-testnet.constellationnetwork.io',
      l0Url: 'https://l0-lb-testnet.constellationnetwork.io',
      l1Url: 'https://l1-lb-testnet.constellationnetwork.io'
    }
  }
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
    nativeToken: string;
    mainnet: string;
    network: string;
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
    nativeToken: 'ETH',
    mainnet: 'mainnet',
    network: 'Ethereum',
  },
  goerli: {
    id: 'goerli',
    value: 'goerli',
    label: 'Goerli',
    rpcEndpoint: QUICKNODE_ETHEREUM_GOERLI,
    explorer: 'https://goerli.etherscan.io/',
    explorerAPI: 'https://api-goerli.etherscan.io',
    chainId: 5,
    nativeToken: 'ETH',
    mainnet: 'mainnet',
    network: 'Ethereum',
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
    nativeToken: string;
    mainnet: string;
    network: string;
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
    nativeToken: 'AVAX',
    mainnet: 'avalanche-mainnet',
    network: 'Avalanche',
  },
  ['avalanche-testnet']: {
    id: 'avalanche-testnet',
    value: 'avalanche-testnet',
    label: 'Fuji Testnet',
    rpcEndpoint: QUICKNODE_AVALANCHE_TESTNET,
    explorer: 'https://testnet.snowtrace.io/',
    explorerAPI: 'https://api-testnet.snowtrace.io',
    chainId: 43113,
    nativeToken: 'AVAX',
    mainnet: 'avalanche-mainnet',
    network: 'Avalanche',
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
    nativeToken: string;
    mainnet: string;
    network: string;
  };
} = {
  bsc: {
    id: 'bsc',
    value: 'bsc',
    label: 'BSC Mainnet',
    rpcEndpoint: QUICKNODE_BSC_MAINNET,
    explorer: 'https://bscscan.com/',
    explorerAPI: 'https://api.bscscan.com',
    chainId: 56,
    nativeToken: 'BNB',
    mainnet: 'bsc',
    network: 'BSC',
  },
  ['bsc-testnet']: {
    id: 'bsc-testnet',
    value: 'bsc-testnet',
    label: 'BSC Testnet',
    rpcEndpoint: QUICKNODE_BSC_TESTNET,
    explorer: 'https://testnet.bscscan.com/',
    explorerAPI: 'https://api-testnet.bscscan.com',
    chainId: 97,
    nativeToken: 'BNB',
    mainnet: 'bsc',
    network: 'BSC',
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
    nativeToken: string;
    mainnet: string;
    network: string;
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
    nativeToken: 'MATIC',
    mainnet: 'matic',
    network: 'Polygon',
  },
  maticmum: {
    id: 'maticmum',
    value: 'maticmum',
    label: 'Maticmum Testnet',
    rpcEndpoint: QUICKNODE_POLYGON_TESTNET,
    explorer: 'https://mumbai.polygonscan.com/',
    explorerAPI: 'https://api-testnet.polygonscan.com',
    chainId: 80001,
    nativeToken: 'MATIC',
    mainnet: 'matic',
    network: 'Polygon',
  },
};

export const ALL_EVM_CHAINS = {
  ...ETH_NETWORK,
  ...AVALANCHE_NETWORK,
  ...BSC_NETWORK,
  ...POLYGON_NETWORK
};

export const ASSET_PRICE_API = 'https://pro-api.coingecko.com/api/v3/simple/price';
export const TOKEN_INFO_API =
  'https://pro-api.coingecko.com/api/v3/coins';
export const ERC20_TOKENS_API =
  'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem';
export const ERC20_TOKENS_WITH_ADDRESS_API =
  'https://pro-api.coingecko.com/api/v3/coins/list?include_platform=true';
export const SEARCH_API =
  'https://pro-api.coingecko.com/api/v3/search?query=';
export const COINGECKO_API_KEY_PARAM = `x_cg_pro_api_key=${COINGECKO_API_KEY}`
export const NFT_MAINNET_API = 'https://api.opensea.io/api/v1/';
export const NFT_TESTNET_API = 'https://testnets-api.opensea.io/api/v1/';

export const CONSTELLATION_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/constellation-logo.png';
export const ETHEREUM_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-logo.png';
export const ETHEREUM_DEFAULT_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-default-logo.png';
export const AVALANCHE_DEFAULT_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avalanche-default-logo.png';
export const BSC_DEFAULT_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc-logo.png';
export const POLYGON_DEFAULT_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon-default-logo.png';
export const AVALANCHE_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avalanche-logo.png';
export const BSC_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc-logo.png';
export const POLYGON_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon-logo.png';
export const LATTICE_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/lattice-logo.png';
export const ALKIMI_LOGO = 'https://assets.coingecko.com/coins/images/17979/small/alkimi.PNG';
export const DODI_LOGO = 'https://lattice-exchange-assets.s3.amazonaws.com/dodi-logo.png';
export const GEOJAM_LOGO = 'https://lattice-exchange-assets.s3.amazonaws.com/geojam.png';
export const SIMPLEX_LOGO = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/simplex-logo.png';

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