import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { truncateString } from 'scenes/home/helpers';
import { OPENSEA_LOGOS_MAP, ICON_SIZE, MAX_LENGTH } from './constants';
import ICardNFT from './types';
import styles from './CardNFT.scss';

const CardNFT: FC<ICardNFT> = ({ title, subtitle, logo, chain, onPress }) => {
  if (!chain) return null;

  const NetworkIcon = OPENSEA_LOGOS_MAP[chain];

  return (
    <div onClick={onPress} className={styles.container}>
      <div>
        <img src={logo} className={styles.image} />
        <div className={styles.networkContainer}>
          <img src={`/${NetworkIcon}`} height={ICON_SIZE} width={ICON_SIZE} />
        </div>
      </div>
      <div className={styles.textContainer}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
          extraStyles={styles.title}
        >
          {truncateString(title || '-', MAX_LENGTH)}
        </TextV3.CaptionStrong>
        <div className={styles.itemsContainer}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.subtitle}
          >
            Items:
          </TextV3.Caption>
          <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>{subtitle}</TextV3.Caption>
        </div>
      </div>
    </div>
  );
};

export default CardNFT;
