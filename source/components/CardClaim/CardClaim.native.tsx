import React, { FC, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import Sheet from 'components/Sheet';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import DotsIcon from 'assets/images/svg/dots-horizontal.svg';
import InfoIcon from 'assets/images/svg/info-outlined.svg';
import ViewOffIcon from 'assets/images/svg/view-off.svg';
import { ELPACA_LARGE_LOGO } from 'constants/index';
import { COLORS_ENUMS } from 'assets/styles/colors';
import IconDropdown from 'components/IconDropdown';
import {
  ACTIVE,
  ALREADY_CLAIMED,
  CAMERA_EMOJI,
  CHECK_EMOJI,
  CLAIM_WINDOW,
  DOTS_SIZE,
  COLD_EMOJI,
  CURRENT_STREAK,
  EPOCHS_LEFT,
  FIRE_EMOJI,
  LEARN_MORE,
  PACA_EMOJI,
  TIME_EMOJI,
  TIME_LEFT,
  TITLE,
  TOTAL_CLAIMED,
  WAITING,
  INFO_CONTENT,
  HIDE_SIZE,
} from './constants';
import ICardClaim from './types';
import styles from './styles';
import { IIconDropdownOptions } from '../IconDropdown/types';

const CardClaim: FC<ICardClaim> = ({
  currentStreak,
  totalEarned,
  currentClaimWindow,
  amount,
  loading,
  showError,
  claimEnabled,
  epochsLeft,
  handleClaim,
  handleLearnMore,
  handleHideCard,
}) => {
  const [showClaimWindowInfo, setShowClaimWindowInfo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const STREAK_EMOJI = currentStreak === 0 ? COLD_EMOJI : FIRE_EMOJI;
  const claimWindowValue = claimEnabled ? ACTIVE : WAITING;
  const claimWindowEmoji = claimEnabled ? CHECK_EMOJI : TIME_EMOJI;
  const claimWindowStyle = claimEnabled && styles.greenText;
  const infoIconColor = showClaimWindowInfo ? '#4631B2' : '#4B5563';
  const claimText = showError
    ? currentClaimWindow
    : claimEnabled
    ? `Claim ${amount} PACA`
    : `PACA claimed`;

  const renderSheetHeader = () => {
    return (
      <View style={styles.sheetHeader}>
        <InfoIcon color="#000" height={24} width={24} style={styles.iconHeader} />
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{CLAIM_WINDOW}</TextV3.BodyStrong>
      </View>
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    onPress: toggleMenu,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextV3.LabelSemiStrong
          color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
          extraStyles={styles.title}
        >
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
          {showError ? (
            <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
              {ALREADY_CLAIMED}
            </TextV3.CaptionRegular>
          ) : (
            <>
              <View style={styles.infoItem}>
                <View style={styles.claimWindowItem}>
                  <TextV3.Caption
                    color={COLORS_ENUMS.SECONDARY_TEXT}
                    extraStyles={styles.itemKey}
                  >
                    {CLAIM_WINDOW}:
                  </TextV3.Caption>
                  <TouchableOpacity
                    onPress={() => setShowClaimWindowInfo(true)}
                    style={styles.infoIconContainer}
                  >
                    <InfoIcon color={infoIconColor} height={14} width={14} />
                  </TouchableOpacity>
                </View>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={[styles.itemValue, claimWindowStyle]}
                >
                  {claimWindowValue}
                  {` `}
                  {claimWindowEmoji}
                </TextV3.Caption>
              </View>
              <View style={styles.infoItem}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {EPOCHS_LEFT}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  {epochsLeft}
                  {` `}
                  {CAMERA_EMOJI}
                </TextV3.Caption>
              </View>
              <View style={[styles.infoItem, styles.border]}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {TIME_LEFT}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  ~{currentClaimWindow}
                  {` `}
                  {TIME_EMOJI}
                </TextV3.Caption>
              </View>
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
                  {currentStreak}
                  {` `}
                  {STREAK_EMOJI}
                </TextV3.Caption>
              </View>
              <View style={styles.infoItem}>
                <TextV3.Caption
                  color={COLORS_ENUMS.SECONDARY_TEXT}
                  extraStyles={styles.itemKey}
                >
                  {TOTAL_CLAIMED}
                </TextV3.Caption>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={styles.itemValue}
                >
                  {totalEarned}
                  {` `}
                  {PACA_EMOJI}
                </TextV3.Caption>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.claimButton}>
          <ButtonV3
            extraStyles={styles.button}
            extraTitleStyles={styles.buttonTitle}
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            disabled={!claimEnabled || loading}
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
      <Sheet
        isVisible={showClaimWindowInfo}
        onClosePress={() => setShowClaimWindowInfo(false)}
        height={240}
        backdropOpacity={0.2}
        showCloseButton
        title={{
          label: renderSheetHeader(),
          align: 'left',
        }}
      >
        <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
          {INFO_CONTENT}
        </TextV3.CaptionRegular>
      </Sheet>
    </View>
  );
};

export default CardClaim;
