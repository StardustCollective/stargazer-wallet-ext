import EthLogo from 'assets/images/svg/eth-icon.svg';
import AvaxLogo from 'assets/images/svg/avax-icon.svg';
import BscLogo from 'assets/images/svg/bsc-icon.svg';
import PolygonLogo from 'assets/images/svg/matic-icon.svg';
import { OpenSeaSupportedChains } from 'state/nfts/types';

export const MAX_LENGTH = 14;
export const ICON_SIZE = 16;

export const OPENSEA_LOGOS_MAP: { [chain: string]: string } = {
  [OpenSeaSupportedChains.ETHEREUM]: EthLogo,
  [OpenSeaSupportedChains.SEPOLIA]: EthLogo,
  [OpenSeaSupportedChains.POLYGON]: PolygonLogo,
  [OpenSeaSupportedChains.POLYGON_TESTNET]: PolygonLogo,
  [OpenSeaSupportedChains.AVALANCHE]: AvaxLogo,
  [OpenSeaSupportedChains.AVALANCHE_FUJI]: AvaxLogo,
  [OpenSeaSupportedChains.BSC]: BscLogo,
  [OpenSeaSupportedChains.BSC_TESTNET]: BscLogo,
};
