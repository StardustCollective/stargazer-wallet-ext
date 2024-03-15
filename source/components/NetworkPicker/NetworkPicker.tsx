///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up-white.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down-white.svg';

///////////////////////
// Types
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import INetworkPicker from './types';

///////////////////////
// Styles
///////////////////////

import styles from './NetworkPicker.scss';

///////////////////////
// Constants
///////////////////////

const NetworkPicker: FC<INetworkPicker> = ({
  title,
  isOpen,
  onPress,
  icon = null,
}): JSX.Element => {
  const ArrowIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div onClick={onPress} className={styles.container}>
      {!!icon && (
        <div className={styles.iconContainer}>
          <img src={icon} className={styles.icon} alt="icon logo" />
        </div>
      )}
      <div className={styles.titleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE}>{title}</TextV3.CaptionStrong>
      </div>
      <div className={styles.arrowIconContainer}>
        <img src={`/${ArrowIcon}`} className={styles.arrowIcon} alt="arrow icon" />
      </div>
    </div>
  );
};

export default NetworkPicker;
