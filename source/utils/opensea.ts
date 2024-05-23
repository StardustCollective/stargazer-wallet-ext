import {
  AVALANCHE_NETWORK,
  BSC_NETWORK,
  ETH_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';
import { OpenSeaSupportedChains } from 'state/nfts/types';

export const OPENSEA_CHAINS_MAP: { [network: string]: OpenSeaSupportedChains } = {
  [ETH_NETWORK.mainnet.id]: OpenSeaSupportedChains.ETHEREUM,
  [ETH_NETWORK.sepolia.id]: OpenSeaSupportedChains.SEPOLIA,
  [POLYGON_NETWORK.matic.id]: OpenSeaSupportedChains.POLYGON,
  [POLYGON_NETWORK.amoy.id]: OpenSeaSupportedChains.POLYGON_TESTNET,
  [AVALANCHE_NETWORK['avalanche-mainnet'].id]: OpenSeaSupportedChains.AVALANCHE,
  [AVALANCHE_NETWORK['avalanche-testnet'].id]: OpenSeaSupportedChains.AVALANCHE_FUJI,
  [BSC_NETWORK.bsc.id]: OpenSeaSupportedChains.BSC,
  [BSC_NETWORK['bsc-testnet'].id]: OpenSeaSupportedChains.BSC_TESTNET,
};

export const OPENSEA_NETWORK_MAP: { [chain: string]: any } = {
  [OpenSeaSupportedChains.ETHEREUM]: ETH_NETWORK.mainnet,
  [OpenSeaSupportedChains.SEPOLIA]: ETH_NETWORK.sepolia,
  [OpenSeaSupportedChains.POLYGON]: POLYGON_NETWORK.matic,
  [OpenSeaSupportedChains.POLYGON_TESTNET]: POLYGON_NETWORK.amoy,
  [OpenSeaSupportedChains.AVALANCHE]: AVALANCHE_NETWORK['avalanche-mainnet'],
  [OpenSeaSupportedChains.AVALANCHE_FUJI]: AVALANCHE_NETWORK['avalanche-testnet'],
  [OpenSeaSupportedChains.BSC]: BSC_NETWORK.bsc,
  [OpenSeaSupportedChains.BSC_TESTNET]: BSC_NETWORK['bsc-testnet'],
};

export const isOpenSeaTestnet = (chain: OpenSeaSupportedChains): boolean => {
  return [
    OpenSeaSupportedChains.SEPOLIA,
    OpenSeaSupportedChains.BSC_TESTNET,
    OpenSeaSupportedChains.AVALANCHE_FUJI,
    OpenSeaSupportedChains.POLYGON_TESTNET,
  ].includes(chain);
};
