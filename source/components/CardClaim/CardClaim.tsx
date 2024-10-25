import React, { FC } from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import CloseIcon from 'assets/images/svg/close.svg';
import ICardClaim from './types';
import styles from './CardClaim.scss';
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
import { ELPACA_LARGE_LOGO } from 'constants/index';
import { COLORS_ENUMS } from 'assets/styles/colors';

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
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={ELPACA_LARGE_LOGO} className={styles.image} />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.titleContainer}>
          <TextV3.LabelSemiStrong color={COLORS_ENUMS.PRIMARY_LIGHTER_1}>
            {TITLE}
          </TextV3.LabelSemiStrong>
        </div>
        <div className={styles.info}>
          {showError ? (
            <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>
              {ALREADY_CLAIMED}
            </TextV3.Caption>
          ) : (
            <>
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
                  {currentStreak} {``}
                  {STREAK_EMOJI}
                </TextV3.Caption>
              </div>
              <div className={styles.infoItem}>
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
              </div>
              <div className={clsx(styles.infoItem, styles.noBorder)}>
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
              </div>
            </>
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonItem}>
            <ButtonV3
              extraStyle={clsx(styles.button, styles.claimButton)}
              extraTitleStyles={styles.buttonTitle}
              extraLoaderStyle={styles.loader}
              type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
              size={BUTTON_SIZES_ENUM.SMALL}
              disabled={!claimEnabled}
              label={claimText}
              loading={loading}
              loadingSize={14}
              onClick={handleClaim}
            />
          </div>
          <div className={styles.buttonItem}>
            <ButtonV3
              extraStyle={styles.button}
              extraTitleStyles={styles.buttonTitle}
              type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
              size={BUTTON_SIZES_ENUM.SMALL}
              label={LEARN_MORE}
              onClick={handleLearnMore}
            />
          </div>
        </div>
      </div>
      <div onClick={handleClose} className={styles.close}>
        <img src={`/${CloseIcon}`} width={CLOSE_SIZE} height={CLOSE_SIZE} />
      </div>
    </div>
  );
};

export default CardClaim;
