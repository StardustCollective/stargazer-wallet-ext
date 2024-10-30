import React, { FC } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import CloseIcon from 'assets/images/svg/close.svg';
import { ELPACA_LARGE_LOGO } from 'constants/index';
import {
  ALREADY_CLAIMED,
  CLOSE_SIZE,
  COLD_EMOJI,
  CURRENT_STREAK,
  CURRENT_WINDOW,
  FIRE_EMOJI,
  LEARN_MORE,
  NEXT_WINDOW,
  PACA_EMOJI,
  TIME_EMOJI,
  TITLE,
  TOTAL_EARNED,
} from './constants';
import ICardClaim from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

const CardClaim: FC<ICardClaim> = ({
  currentStreak,
  totalEarned,
  currentClaimWindow,
  amount,
  loading,
  showError,
  claimEnabled,
  handleClaim,
  handleLearnMore,
  handleClose,
}) => {
  const STREAK_EMOJI = currentStreak === 0 ? COLD_EMOJI : FIRE_EMOJI;
  const windowText = claimEnabled ? CURRENT_WINDOW : NEXT_WINDOW;
  const claimText = showError
    ? currentClaimWindow
    : claimEnabled
    ? `Claim ${amount} PACA`
    : `PACA claimed`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleClose} style={styles.close}>
        <CloseIcon width={CLOSE_SIZE} height={CLOSE_SIZE} />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: ELPACA_LARGE_LOGO,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <TextV3.LabelSemiStrong color={COLORS_ENUMS.PRIMARY_LIGHTER_1}>
            {TITLE}
          </TextV3.LabelSemiStrong>
        </View>
        <View style={styles.info}>
          {showError ? (
            <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>
              {ALREADY_CLAIMED}
            </TextV3.Caption>
          ) : (
            <>
              <View style={styles.infoItem}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {CURRENT_STREAK}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  {currentStreak} {``}
                  {STREAK_EMOJI}
                </TextV3.Caption>
              </View>
              <View style={styles.infoItem}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {TOTAL_EARNED}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  {totalEarned} {``}
                  {PACA_EMOJI}
                </TextV3.Caption>
              </View>
              <View style={[styles.infoItem, styles.noBorder]}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {windowText}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  {currentClaimWindow} {``}
                  {TIME_EMOJI}
                </TextV3.Caption>
              </View>
            </>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.claimButton}>
            <ButtonV3
              extraStyles={styles.button}
              extraTitleStyles={styles.buttonTitle}
              type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
              size={BUTTON_SIZES_ENUM.SMALL}
              disabled={!claimEnabled}
              title={claimText}
              loading={loading}
              onPress={handleClaim}
            />
          </View>
          <View style={styles.learnMoreButton}>
            <ButtonV3
              extraStyles={styles.button}
              extraTitleStyles={styles.buttonTitle}
              type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
              size={BUTTON_SIZES_ENUM.SMALL}
              title={LEARN_MORE}
              onPress={handleLearnMore}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardClaim;
