export const TOKEN = 'token';

export const X_LATTICE_API_KEY = 'x-lattice-api-key';
export const X_LATTICE_REQ_TOKEN = 'x-lattice-req-token';
export const X_LATTICE_SIG = 'x-lattice-sig';

export enum ExplorerExternalService {
  EthMainnet = 'explorer-ethereum-mainnet',
  EthTestnet = 'explorer-ethereum-sepolia',
  AvaxMainnet = 'explorer-avalanche-mainnet',
  AvaxTestnet = 'explorer-avalanche-testnet',
  BscMainnet = 'explorer-bsc-mainnet',
  BscTestnet = 'explorer-bsc-testnet',
  PolygonMainnet = 'explorer-polygon-mainnet',
  PolygonTestnet = 'explorer-polygon-amoy',
}

export enum NodeExternalService {
  EthMainnet = 'node-ethereum-mainnet',
  EthTestnet = 'node-ethereum-sepolia',
  AvaxMainnet = 'node-avalanche-mainnet',
  AvaxTestnet = 'node-avalanche-testnet',
  BscMainnet = 'node-bsc-mainnet',
  BscTestnet = 'node-bsc-testnet',
  PolygonMainnet = 'node-polygon-mainnet',
  PolygonTestnet = 'node-polygon-amoy',
}

export enum ExternalService {
  CoinGecko = 'coingecko',
  OpenseaMainnet = 'opensea-mainnet',
  OpenseaTestnet = 'opensea-testnet',
}
