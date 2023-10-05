import React, { FC } from 'react';
import LogoImage from 'assets/images/logo.svg';
import styles from './Start.scss';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import IStart from './types';

const Start: FC<IStart> = ({ onImportClicked, onGetStartedClicked }) => {
  return (
    <div className={styles.home}>
      <TextV3.HeaderLargeRegular align={TEXT_ALIGN_ENUM.CENTER}>
        Welcome to <TextV3.HeaderLarge>Stargazer Wallet</TextV3.HeaderLarge>
      </TextV3.HeaderLargeRegular>
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        extraStyle={styles.createWalletButton}
        label="Create new wallet"
        extraTitleStyles={styles.createWalletButtonText}
        onClick={onGetStartedClicked}
      />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
        size={BUTTON_SIZES_ENUM.LARGE}
        extraStyle={styles.restoreButton}
        label="Restore Stargazer wallet"
        extraTitleStyles={styles.restoreButtonText}
        onClick={onImportClicked}
      />
    </div>
  );
};

export default Start;
