import React, { FC, useState } from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import Sheet from 'components/Sheet';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import IconDropdown from 'components/IconDropdown';
import InfoIconGray from 'assets/images/svg/info-outlined-gray.svg';
import InfoIconPurple from 'assets/images/svg/info-outlined-purple.svg';
import InfoIconBlack from 'assets/images/svg/info-outlined-black.svg';
import DotsIcon from 'assets/images/svg/dots-horizontal.svg';
import ViewOffIcon from 'assets/images/svg/view-off.svg';
import { ELPACA_LARGE_LOGO } from 'constants/index';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IIconDropdownOptions } from 'components/IconDropdown/types';
import ICardClaim from './types';
import styles from './CardClaim.scss';
import {
  ACTIVE,
  ALREADY_CLAIMED,
  CAMERA_EMOJI,
  CHECK_EMOJI,
  CLAIM_WINDOW,
  COLD_EMOJI,
  CURRENT_STREAK,
  DOTS_SIZE,
  EPOCHS_LEFT,
  FIRE_EMOJI,
  HIDE_SIZE,
  INFO_CONTENT,
  LEARN_MORE,
  PACA_EMOJI,
  TIME_EMOJI,
  TIME_LEFT,
  TITLE,
  TOTAL_CLAIMED,
  WAITING,
} from './constants';

const CardClaim: FC<ICardClaim> = ({
  currentStreak,
  totalEarned,
  currentClaimWindow,
  amount,
  loading,
  epochsLeft,
  showError,
  claimEnabled,
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
  const InfoIcon = showClaimWindowInfo ? InfoIconPurple : InfoIconGray;

  const claimText = showError
    ? currentClaimWindow
    : claimEnabled
    ? `Claim ${amount} PACA`
    : `PACA claimed`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderSheetHeader = () => {
    return (
      <div className={styles.sheetHeader}>
        <img
          src={`/${InfoIconBlack}`}
          height={20}
          width={20}
          className={styles.iconHeader}
        />
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{CLAIM_WINDOW}</TextV3.BodyStrong>
      </div>
    );
  };

  const options: IIconDropdownOptions = {
    icon: <img src={`/${DotsIcon}`} height={DOTS_SIZE} width={DOTS_SIZE} />,
    items: [
      {
        id: 'hide-paca-card',
        label: 'Hide PACA claim card',
        icon: <img src={`/${ViewOffIcon}`} height={HIDE_SIZE} width={HIDE_SIZE} />,
        onPressItem: handleHideCard,
      },
    ],
    isOpen: isMenuOpen,
    onPress: toggleMenu,
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <TextV3.LabelSemiStrong
            color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
            extraStyles={styles.title}
          >
            {TITLE}
          </TextV3.LabelSemiStrong>
        </div>
        <IconDropdown options={options} />
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.imageContainer}>
          <img src={ELPACA_LARGE_LOGO} className={styles.image} />
        </div>
        <div className={styles.info}>
          {showError ? (
            <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
              {ALREADY_CLAIMED}
            </TextV3.CaptionRegular>
          ) : (
            <>
              {/* Claim window */}
              <div className={styles.infoItem}>
                <div className={styles.claimWindowItem}>
                  <TextV3.Caption
                    color={COLORS_ENUMS.SECONDARY_TEXT}
                    extraStyles={styles.itemKey}
                  >
                    {CLAIM_WINDOW}
                  </TextV3.Caption>
                  <div
                    onClick={() => setShowClaimWindowInfo(true)}
                    className={styles.infoIconContainer}
                  >
                    <img src={`/${InfoIcon}`} className={styles.infoIcon} />
                  </div>
                </div>
                <TextV3.Caption
                  color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
                  extraStyles={clsx(styles.itemValue, claimWindowStyle)}
                >
                  {claimWindowValue}
                  {` `}
                  {claimWindowEmoji}
                </TextV3.Caption>
              </div>

              {/* Epochs left */}
              <div className={styles.infoItem}>
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
              </div>

              {/* Time left */}
              <div className={clsx(styles.infoItem, styles.border)}>
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
              </div>

              {/* Current claim streak */}
              <div className={styles.infoItem}>
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
              </div>

              {/* Total PACA claimed */}
              <div className={styles.infoItem}>
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
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.buttonItem}>
          <ButtonV3
            extraStyle={clsx(styles.button, styles.claimButton)}
            extraTitleStyles={styles.buttonTitle}
            extraLoaderStyle={styles.loader}
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            disabled={!claimEnabled || loading}
            label={claimText}
            loading={loading}
            loadingSize={14}
            onClick={handleClaim}
          />
        </div>
        <div className={styles.buttonItem}>
          <ButtonV3
            extraStyle={clsx(styles.button, styles.learnMoreButton)}
            extraTitleStyles={styles.buttonTitle}
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            size={BUTTON_SIZES_ENUM.SMALL}
            label={LEARN_MORE}
            onClick={handleLearnMore}
          />
        </div>
      </div>

      <Sheet
        isVisible={showClaimWindowInfo}
        onClosePress={() => setShowClaimWindowInfo(false)}
        snaps={[210]}
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
    </div>
  );
};

export default CardClaim;
