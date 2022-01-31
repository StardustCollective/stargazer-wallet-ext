export const STORE_PORT = 'STARGAZER';

export const DAG_NETWORK: {
  [networkId: string]: {
    id: string;
    label: string;
    beUrl: string;
    lbUrl: string;
  };
} = {
  //
  main: {
    id: 'main',
    label: 'Main Constellation Network',
    beUrl: 'https://www.dagexplorer.io/api/scan',
    lbUrl: 'https://www.dagexplorer.io/api/node',
  },
  main2: {
    id: 'main2',
    label: 'Main Constellation Network',
    beUrl: 'https://block-explorer.constellationnetwork.io',
    lbUrl: 'http://lb.constellationnetwork.io:9000',
  },
  ceres: {
    id: 'ceres',
    label: 'Ceres Test Network',
    beUrl: 'https://api-be.exchanges.constellationnetwork.io',
    lbUrl: 'http://lb.exchanges.constellationnetwork.io:9000',
  },
};

export const ETH_NETWORK: {
  [networkId: string]: {
    id: string;
    label: string;
    etherscan: string;
    chainId: number;
  };
} = {
  mainnet: {
    id: 'mainnet',
    label: 'Ethereum Mainnet',
    etherscan: 'https://etherscan.io/',
    chainId: 1,
  },
  testnet: {
    id: 'testnet',
    label: 'Ethereum Testnet',
    etherscan: 'https://ropsten.etherscan.io/',
    chainId: 3,
  },
};

export const ASSET_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price';
export const TOKEN_INFO_API =
  'https://api.coingecko.com/api/v3/coins/ethereum/contract/';
export const NFT_MAINNET_API = 'https://api.opensea.io/api/v1/';
export const NFT_TESTNET_API = 'https://rinkeby-api.opensea.io/api/v1/';
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
