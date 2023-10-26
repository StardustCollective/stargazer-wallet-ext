import React, { FC } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import EthLogo from 'assets/images/svg/eth-icon.svg';
import AvaxLogo from 'assets/images/svg/avax-icon.svg';
import BscLogo from 'assets/images/svg/bsc-icon.svg';
import PolygonLogo from 'assets/images/svg/matic-icon.svg';
import ICardNFT from './types';
import { OpenSeaSupportedChains } from 'state/nfts/types';
import { truncateString } from 'scenes/home/helpers';
import styles from './styles';

const MAX_LENGTH = 14;
const ICON_SIZE = 16;

export const OPENSEA_LOGOS_MAP: { [chain: string]: string } = {
  [OpenSeaSupportedChains.ETHEREUM]: EthLogo,
  [OpenSeaSupportedChains.GOERLI]: EthLogo,
  [OpenSeaSupportedChains.POLYGON]: PolygonLogo,
  [OpenSeaSupportedChains.POLYGON_MUMBAI]: PolygonLogo,
  [OpenSeaSupportedChains.AVALANCHE]: AvaxLogo,
  [OpenSeaSupportedChains.AVALANCHE_FUJI]: AvaxLogo,
  [OpenSeaSupportedChains.BSC]: BscLogo,
  [OpenSeaSupportedChains.BSC_TESTNET]: BscLogo,
};

const CardNFT: FC<ICardNFT> = ({
  title,
  subtitle,
  logo,
  chain,
  onPress,
}): JSX.Element => {
  const NetworkIcon = OPENSEA_LOGOS_MAP[chain];

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: logo }} style={styles.image} />
        <View style={styles.networkContainer}>
          <NetworkIcon width={ICON_SIZE} height={ICON_SIZE} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
          extraStyles={styles.title}
        >
          {truncateString(title || '-', MAX_LENGTH)}
        </TextV3.CaptionStrong>
        <View style={styles.itemsContainer}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.subtitle}
          >
            Items:
          </TextV3.Caption>
          <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>{subtitle}</TextV3.Caption>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardNFT;
