///////////////////////////
// Modules
///////////////////////////

import React from 'react';

///////////////////////////
// Styles
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import LogoImage from 'assets/images/logo-s.svg';
import MenuIcon from '@material-ui/icons/Menu';

///////////////////////////
// Styles
///////////////////////////

import styles from './home.scss';
import commonStyles from '../commonStyles';

///////////////////////////
// Constants
///////////////////////////

const HEADER_TITLE_STRING = 'Wallet';

///////////////////////////
// Header
///////////////////////////

const homeHeader = (onMenuButtonClicked: () => void) => {
  
  return {
    ...commonStyles,
    title: HEADER_TITLE_STRING,
    headerLeft: () => (
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
    ),
    headerRight: () => (
      <IconButton
        className={`${styles.buttonRight} ${styles.more}`}
        onClick={onMenuButtonClicked}
      >
        <MenuIcon className={styles.buttonRight} />
      </IconButton>
    ),
  }
};

export default homeHeader;