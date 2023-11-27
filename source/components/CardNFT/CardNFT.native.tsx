import React, { FC } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import ICardNFT from './types';
import { truncateString } from 'scenes/home/helpers';
import { OPENSEA_LOGOS_MAP, ICON_SIZE, MAX_LENGTH } from './constants';
import styles from './styles';

const CardNFT: FC<ICardNFT> = ({ title, subtitle, logo, chain, onPress }) => {
  if (!chain) return null;

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
