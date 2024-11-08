import {
  AvalancheChainId,
  AvalancheChainValue,
  BSCChainId,
  BSCChainValue,
  EthChainId,
  EthChainValue,
  PolygonChainId,
  PolygonChainValue,
} from 'scripts/Background/controllers/EVMChainController/types';
import { StargazerChain } from 'scripts/common';
import { isProd, isNative } from 'utils/envUtil';
import {
  ExplorerExternalService,
  NodeExternalService,
} from 'utils/httpRequests/constants';

export const STORE_PORT = 'STARGAZER';

export const STARGAZER_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/stargazer.png';
export const CONSTELLATION_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/dag.png';
export const CONSTELLATION_DEFAULT_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/dag-default.png';
export const DOR_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/dor.png';
export const ELPACA_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/elpaca.png';
export const ELPACA_LARGE_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/elpaca-portrait.png';
export const ETHEREUM_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/eth.png';
export const ETHEREUM_DEFAULT_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/eth-default.png';
export const AVALANCHE_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avax.png';
export const AVALANCHE_DEFAULT_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avax-default.png';
export const BSC_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc.png';
export const BSC_DEFAULT_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc-default.png';
export const POLYGON_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon.png';
export const POLYGON_DEFAULT_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon-default.png';
export const LATTICE_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ltx.png';
export const VE_LTX_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/veltx.png';
export const DODI_LOGO = 'https://lattice-exchange-assets.s3.amazonaws.com/dodi-logo.png';
export const LEET_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/leet.png';
export const ALKIMI_LOGO =
  'https://assets.coingecko.com/coins/images/17979/small/alkimi.PNG';
export const JENNYCO_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/jco.png';
export const GEOJAM_LOGO = 'https://lattice-exchange-assets.s3.amazonaws.com/geojam.png';
export const SIMPLEX_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/simplex-logo.png';
export const C14_LOGO =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/c14.png';
export const PLACEHOLDER_IMAGE =
  'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/placeholder.png';

export const DAG_NETWORK: {
  [networkId: string]: {
    id: string;
    label: string;
    version: string;
    testnet: boolean;
    explorer: string;
    chainId: number;
    hexChainId: string;
    logo: string;
    network: string;
    config: {
      beUrl: string; // 1.0 and 2.0
      lbUrl?: string; // 1.0
      l0Url?: string; // 2.0
      l1Url?: string; // 2.0
    };
  };
} = {
  main2: {
    id: 'main2',
    label: 'Mainnet',
    version: '2.0',
    testnet: false,
    explorer: 'https://mainnet.dagexplorer.io',
    chainId: 1,
    hexChainId: '0x1',
    logo: CONSTELLATION_LOGO,
    network: 'Constellation',
    config: {
      beUrl: 'https://be-mainnet.constellationnetwork.io',
      l0Url: 'https://l0-lb-mainnet.constellationnetwork.io',
      l1Url: 'https://l1-lb-mainnet.constellationnetwork.io',
    },
  },
  test2: {
    id: 'test2',
    label: 'Testnet',
    version: '2.0',
    testnet: true,
    explorer: 'https://testnet.dagexplorer.io',
    chainId: 3,
    hexChainId: '0x3',
    logo: CONSTELLATION_LOGO,
    network: 'Constellation',
    config: {
      beUrl: 'https://be-testnet.constellationnetwork.io',
      l0Url: 'https://l0-lb-testnet.constellationnetwork.io',
      l1Url: 'https://l1-lb-testnet.constellationnetwork.io',
    },
  },
  integration2: {
    id: 'integration2',
    label: 'IntegrationNet',
    version: '2.0',
    testnet: true,
    explorer: 'https://integrationnet.dagexplorer.io',
    chainId: 4,
    hexChainId: '0x4',
    logo: CONSTELLATION_LOGO,
    network: 'Constellation',
    config: {
      beUrl: 'https://be-integrationnet.constellationnetwork.io',
      l0Url: 'https://l0-lb-integrationnet.constellationnetwork.io',
      l1Url: 'https://l1-lb-integrationnet.constellationnetwork.io',
    },
  },
  local2: {
    id: 'local2',
    label: 'Local',
    version: '2.0',
    testnet: true,
    explorer: '',
    chainId: 5,
    hexChainId: '0x5',
    logo: CONSTELLATION_LOGO,
    network: 'Constellation',
    config: {
      beUrl: '',
      l0Url: '',
      l1Url: '',
    },
  },
};

export const ETH_NETWORK: {
  [networkId: string]: {
    id: EthChainId;
    value: EthChainValue;
    label: string;
    explorer: string;
    chainId: number;
    hexChainId: string;
    rpcEndpoint: string;
    explorerID: string;
    nativeToken: string;
    mainnet: string;
    network: string;
    networkId: string;
    logo: string;
  };
} = {
  mainnet: {
    id: 'mainnet',
    value: 'homestead',
    label: 'Mainnet',
    rpcEndpoint: NodeExternalService.EthMainnet,
    explorer: 'https://etherscan.io/',
    explorerID: ExplorerExternalService.EthMainnet,
    chainId: 1,
    hexChainId: '0x1',
    nativeToken: 'ETH',
    mainnet: 'mainnet',
    network: 'Ethereum',
    networkId: StargazerChain.ETHEREUM,
    logo: ETHEREUM_LOGO,
  },
  sepolia: {
    id: 'sepolia',
    value: 'sepolia',
    label: 'Sepolia',
    rpcEndpoint: NodeExternalService.EthTestnet,
    explorer: 'https://sepolia.etherscan.io/',
    explorerID: ExplorerExternalService.EthTestnet,
    chainId: 11155111,
    hexChainId: '0xaa36a7',
    nativeToken: 'ETH',
    mainnet: 'mainnet',
    network: 'Ethereum',
    networkId: StargazerChain.ETHEREUM,
    logo: ETHEREUM_LOGO,
  },
};

export const AVALANCHE_NETWORK: {
  [networkId: string]: {
    id: AvalancheChainId;
    value: AvalancheChainValue;
    label: string;
    explorer: string;
    chainId: number;
    hexChainId: string;
    rpcEndpoint: string;
    explorerID: string;
    nativeToken: string;
    mainnet: string;
    network: string;
    networkId: string;
    logo: string;
  };
} = {
  'avalanche-mainnet': {
    id: 'avalanche-mainnet',
    value: 'avalanche-mainnet',
    label: 'Avalanche C-Chain',
    rpcEndpoint: NodeExternalService.AvaxMainnet,
    explorer: 'https://snowtrace.io/',
    explorerID: ExplorerExternalService.AvaxMainnet,
    chainId: 43114,
    hexChainId: '0xa86a',
    nativeToken: 'AVAX',
    mainnet: 'avalanche-mainnet',
    network: 'Avalanche',
    networkId: StargazerChain.AVALANCHE,
    logo: AVALANCHE_LOGO,
  },
  'avalanche-testnet': {
    id: 'avalanche-testnet',
    value: 'avalanche-testnet',
    label: 'Fuji Testnet',
    rpcEndpoint: NodeExternalService.AvaxTestnet,
    explorer: 'https://testnet.snowtrace.io/',
    explorerID: ExplorerExternalService.AvaxTestnet,
    chainId: 43113,
    hexChainId: '0xa869',
    nativeToken: 'AVAX',
    mainnet: 'avalanche-mainnet',
    network: 'Avalanche',
    networkId: StargazerChain.AVALANCHE,
    logo: AVALANCHE_LOGO,
  },
};

export const BSC_NETWORK: {
  [networkId: string]: {
    id: BSCChainId;
    value: BSCChainValue;
    label: string;
    explorer: string;
    chainId: number;
    hexChainId: string;
    rpcEndpoint: string;
    explorerID: string;
    nativeToken: string;
    mainnet: string;
    network: string;
    networkId: string;
    logo: string;
  };
} = {
  bsc: {
    id: 'bsc',
    value: 'bsc',
    label: 'BSC Mainnet',
    rpcEndpoint: NodeExternalService.BscMainnet,
    explorer: 'https://bscscan.com/',
    explorerID: ExplorerExternalService.BscMainnet,
    chainId: 56,
    hexChainId: '0x38',
    nativeToken: 'BNB',
    mainnet: 'bsc',
    network: 'BSC',
    networkId: StargazerChain.BSC,
    logo: BSC_LOGO,
  },
  'bsc-testnet': {
    id: 'bsc-testnet',
    value: 'bsc-testnet',
    label: 'BSC Testnet',
    rpcEndpoint: NodeExternalService.BscTestnet,
    explorer: 'https://testnet.bscscan.com/',
    explorerID: ExplorerExternalService.BscTestnet,
    chainId: 97,
    hexChainId: '0x61',
    nativeToken: 'BNB',
    mainnet: 'bsc',
    network: 'BSC',
    networkId: StargazerChain.BSC,
    logo: BSC_LOGO,
  },
};

export const POLYGON_NETWORK: {
  [networkId: string]: {
    id: PolygonChainId;
    value: PolygonChainValue;
    label: string;
    explorer: string;
    chainId: number;
    hexChainId: string;
    rpcEndpoint: string;
    explorerID: string;
    nativeToken: string;
    mainnet: string;
    network: string;
    networkId: string;
    logo: string;
  };
} = {
  matic: {
    id: 'matic',
    value: 'matic',
    label: 'Polygon Mainnet',
    rpcEndpoint: NodeExternalService.PolygonMainnet,
    explorer: 'https://polygonscan.com/',
    explorerID: ExplorerExternalService.PolygonMainnet,
    chainId: 137,
    hexChainId: '0x89',
    nativeToken: 'MATIC',
    mainnet: 'matic',
    network: 'Polygon',
    networkId: StargazerChain.POLYGON,
    logo: POLYGON_LOGO,
  },
  amoy: {
    id: 'amoy',
    value: 'amoy',
    label: 'Polygon Amoy Testnet',
    rpcEndpoint: NodeExternalService.PolygonTestnet,
    explorer: 'https://amoy.polygonscan.com/',
    explorerID: ExplorerExternalService.PolygonTestnet,
    chainId: 80002,
    hexChainId: '0x13882',
    nativeToken: 'MATIC',
    mainnet: 'matic',
    network: 'Polygon',
    networkId: StargazerChain.POLYGON,
    logo: POLYGON_LOGO,
  },
};

export const ALL_MAINNET_CHAINS = [
  DAG_NETWORK.main2,
  ETH_NETWORK.mainnet,
  AVALANCHE_NETWORK['avalanche-mainnet'],
  BSC_NETWORK.bsc,
  POLYGON_NETWORK.matic,
];

export const ALL_TESTNETS_CHAINS = [
  DAG_NETWORK.test2,
  DAG_NETWORK.integration2,
  DAG_NETWORK.local2,
  ETH_NETWORK.sepolia,
  AVALANCHE_NETWORK['avalanche-testnet'],
  BSC_NETWORK['bsc-testnet'],
  POLYGON_NETWORK.amoy,
];

export const ALL_CHAINS = [...ALL_MAINNET_CHAINS, ...ALL_TESTNETS_CHAINS];

export const ALL_EVM_CHAINS = {
  ...ETH_NETWORK,
  ...AVALANCHE_NETWORK,
  ...BSC_NETWORK,
  ...POLYGON_NETWORK,
};

export const SUPPORTED_HEX_CHAINS = [
  '0x1',
  '0xaa36a7',
  '0xa86a',
  '0xa869',
  '0x89',
  '0x13882',
  '0x38',
  '0x61',
];

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

export const DEFAULT_LANGUAGE = 'en-US';

export const URL_REGEX_PATTERN = '^(https?|ftp)://';

export const DAG_EXPLORER_API_URL = 'https://dyzt5u1o3ld0z.cloudfront.net';
export const C14_CLIENT_ID = 'b69a98b8-c5c1-4c7b-b5a9-46bca9a74480';
export const C14_BASE_URL = 'https://pay.c14.money';

export const BUY_DAG_URL = 'https://howtobuydag.com/';

export const STARGAZER_SWAPPING_BASE_URL_PROD = 'https://api.lattice.exchange/swapping';

const STARGAZER_PROVIDERS_BASE_URL =
  'https://api-staging.lattice.exchange/stargazer-providers';
const STARGAZER_PROVIDERS_BASE_URL_PROD =
  'https://api.lattice.exchange/stargazer-providers';
const PROVIDERS_BASE_URL = isProd
  ? STARGAZER_PROVIDERS_BASE_URL_PROD
  : STARGAZER_PROVIDERS_BASE_URL;

export const GET_ELPACA_API =
  'http://elpaca-l0-2006678808.us-west-1.elb.amazonaws.com:9100/data-application/streak';
export const POST_ELPACA_API =
  'http://elpaca-dl1-550039959.us-west-1.elb.amazonaws.com:9300/data';
export const ELPACA_LEARN_MORE =
  'https://constellationnetwork.medium.com/introducing-the-el-paca-metagraph-ff2b34586918';

export const EXTERNAL_REQUESTS_BASE_URL =
  'https://d2qv688dkixr6z.cloudfront.net/external-requests';

export const GET_QUOTE_API = `${PROVIDERS_BASE_URL}/v3/quote`;
export const PAYMENT_REQUEST_API = `${PROVIDERS_BASE_URL}/payment-request`;
export const GET_SUPPORTED_ASSETS_API = `${PROVIDERS_BASE_URL}/v3/supported-assets`;
export const GET_DEFAULT_TOKENS = `${PROVIDERS_BASE_URL}/default-tokens`;

const SIMPLEX_FORM_BASE_URL = 'https://stargazer-assets.s3.us-east-2.amazonaws.com';
const SIMPLEX_FORM_SUBMISSION_URL_WEB = isProd
  ? `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.web.html?payment_id=`
  : `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.web.staging.html?payment_id=`;
const SIMPLEX_FORM_SUBMISSION_URL_NATIVE = isProd
  ? `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.html?payment_id=`
  : `${SIMPLEX_FORM_BASE_URL}/stargazer-simplex.staging.html?payment_id=`;
export const SIMPLEX_FORM_SUBMISSION_URL = isNative
  ? SIMPLEX_FORM_SUBMISSION_URL_NATIVE
  : SIMPLEX_FORM_SUBMISSION_URL_WEB;
