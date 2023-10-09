import {
  AVALANCHE_NETWORK,
  BSC_NETWORK,
  ETH_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';
import { OpenSeaSupportedChains } from 'state/nfts/types';

export const OPENSEA_CHAINS_MAP: { [network: string]: OpenSeaSupportedChains } = {
  [ETH_NETWORK.mainnet.id]: OpenSeaSupportedChains.ETHEREUM,
  [ETH_NETWORK.goerli.id]: OpenSeaSupportedChains.GOERLI,
  [POLYGON_NETWORK.matic.id]: OpenSeaSupportedChains.POLYGON,
  [POLYGON_NETWORK.maticmum.id]: OpenSeaSupportedChains.POLYGON_MUMBAI,
  [AVALANCHE_NETWORK['avalanche-mainnet'].id]: OpenSeaSupportedChains.AVALANCHE,
  [AVALANCHE_NETWORK['avalanche-testnet'].id]: OpenSeaSupportedChains.AVALANCHE_FUJI,
  [BSC_NETWORK.bsc.id]: OpenSeaSupportedChains.BSC,
  [BSC_NETWORK['bsc-testnet'].id]: OpenSeaSupportedChains.BSC_TESTNET,
};
