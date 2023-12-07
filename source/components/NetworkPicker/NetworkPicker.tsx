///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up-white.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down-white.svg';

///////////////////////
// Types
///////////////////////

import INetworkPicker from './types';

///////////////////////
// Styles
///////////////////////

import styles from './NetworkPicker.scss';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const NetworkPicker: FC<INetworkPicker> = ({
  title,
  isOpen,
  onPress,
  icon = null,
}): JSX.Element => {
  const logoExtraStyle = icon?.includes('constellation') ? styles.constellationLogo : {};
  const iconStyle = clsx(styles.icon, logoExtraStyle);
  const ArrowIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div onClick={onPress} className={styles.container}>
      {!!icon && (
        <div className={styles.iconContainer}>
          <img src={icon} className={iconStyle} />
        </div>
      )}
      <div className={styles.titleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE}>{title}</TextV3.CaptionStrong>
      </div>
      <div className={styles.arrowIconContainer}>
        <img src={`/${ArrowIcon}`} className={styles.arrowIcon} />
      </div>
    </div>
  );
};

export default NetworkPicker;
