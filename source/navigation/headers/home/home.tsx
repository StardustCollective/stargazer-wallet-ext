///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';

///////////////////////////
// Images
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import LogoImage from 'assets/images/logo.svg';
import MenuIcon from '@material-ui/icons/Menu';

///////////////////////////
// Screens
///////////////////////////

import screens from 'navigation/screens';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';

///////////////////////////
// Interfaces
///////////////////////////

interface IHomeHeader {
  navigation: any;
  route: any;
}

///////////////////////////
// Header
///////////////////////////

const homeHeader = ({
  navigation,
}: IHomeHeader) => {

  const onMenuButtonClicked = () => {
    navigation.navigate(screens.settings.main)
  }

  const renderHeaderRight = () => {

    return (
      <IconButton
        id="header-moreButton"
        className={`${styles.buttonRight} ${styles.more}`}
        onClick={onMenuButtonClicked}
      >
        <MenuIcon className={styles.buttonRight} />
      </IconButton>
    )

  }

  return {
    ...config,
    headerLeft: () => (
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
    ),
    headerRight: () => renderHeaderRight(),
  }
};

export default homeHeader;