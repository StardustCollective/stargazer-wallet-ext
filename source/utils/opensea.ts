import {
  AVALANCHE_LOGO,
  AVALANCHE_NETWORK,
  BSC_LOGO,
  BSC_NETWORK,
  ETHEREUM_LOGO,
  ETH_NETWORK,
  POLYGON_LOGO,
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

export const OPENSEA_LOGOS_MAP: { [chain: string]: string } = {
  [OpenSeaSupportedChains.ETHEREUM]: ETHEREUM_LOGO,
  [OpenSeaSupportedChains.GOERLI]: ETHEREUM_LOGO,
  [OpenSeaSupportedChains.POLYGON]: POLYGON_LOGO,
  [OpenSeaSupportedChains.POLYGON_MUMBAI]: POLYGON_LOGO,
  [OpenSeaSupportedChains.AVALANCHE]: AVALANCHE_LOGO,
  [OpenSeaSupportedChains.AVALANCHE_FUJI]: AVALANCHE_LOGO,
  [OpenSeaSupportedChains.BSC]: BSC_LOGO,
  [OpenSeaSupportedChains.BSC_TESTNET]: BSC_LOGO,
};

export const isOpenSeaTestnet = (chain: OpenSeaSupportedChains): boolean => {
  return [
    OpenSeaSupportedChains.GOERLI,
    OpenSeaSupportedChains.POLYGON_MUMBAI,
    OpenSeaSupportedChains.BSC_TESTNET,
    OpenSeaSupportedChains.AVALANCHE_FUJI,
  ].includes(chain);
};
