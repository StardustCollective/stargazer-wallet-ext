import React, { FC, useState } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import DotsIcon from 'assets/images/svg/dots-horizontal.svg';
import DiamondIcon from 'assets/images/svg/diamond.svg';
import ViewOffIcon from 'assets/images/svg/view-off.svg';
import { ELPACA_LARGE_LOGO } from 'constants/index';
import IconDropdown from 'components/IconDropdown';
import {
  DOTS_SIZE,
  WHATS_NEW,
  PACA_EMOJI,
  TITLE,
  TOTAL_CLAIMED,
  HIDE_SIZE,
  CLAIM_NOT_AVAILABLE,
  REWARDS_ENDED,
  THANKS,
} from './constants';
import type ICardClaim from './types';
import type { IIconDropdownOptions } from '../IconDropdown/types';
import styles from './styles';

const CardClaim: FC<ICardClaim> = ({ totalEarned, handleWhatsNext, handleHideCard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const showDiamondIcon = width >= 390;

  const options: IIconDropdownOptions = {
    icon: <DotsIcon width={DOTS_SIZE} height={DOTS_SIZE} />,
    items: [
      {
        id: 'hide-paca-card',
        label: 'Hide PACA claim card',
        icon: <ViewOffIcon width={HIDE_SIZE} height={HIDE_SIZE} />,
        onPressItem: handleHideCard,
      },
    ],
    isOpen: isMenuOpen,
    onPress: () => setIsMenuOpen(!isMenuOpen),
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextV3.LabelSemiStrong extraStyles={styles.title}>
          {TITLE}
        </TextV3.LabelSemiStrong>
        <IconDropdown options={options} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: ELPACA_LARGE_LOGO,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.info}>
          {totalEarned !== null && (
            <View style={styles.infoItem}>
              <TextV3.Caption extraStyles={styles.itemKey}>
                {TOTAL_CLAIMED}
              </TextV3.Caption>
              <TextV3.Caption extraStyles={styles.itemValue}>
                {totalEarned}
                {` `}
                {PACA_EMOJI}
              </TextV3.Caption>
            </View>
          )}
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <TextV3.CaptionStrong extraStyles={styles.cardTitle}>
                {CLAIM_NOT_AVAILABLE}
              </TextV3.CaptionStrong>
              {showDiamondIcon && (
                <DiamondIcon width={16} height={16} style={styles.diamondIcon} />
              )}
            </View>
            <View style={styles.cardTextContainer}>
              <TextV3.CaptionRegular extraStyles={styles.cardText}>
                {REWARDS_ENDED}
              </TextV3.CaptionRegular>
              <TextV3.CaptionRegular extraStyles={styles.cardText}>
                {THANKS}
              </TextV3.CaptionRegular>
            </View>
          </View>
        </View>
      </View>
      <View>
        <ButtonV3
          extraStyles={styles.button}
          extraTitleStyles={styles.buttonTitle}
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.SMALL}
          title={WHATS_NEW}
          onPress={handleWhatsNext}
        />
      </View>
    </View>
  );
};

export default CardClaim;
