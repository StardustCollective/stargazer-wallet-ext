///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';

///////////////////////////
// Images
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import LogoImage from 'assets/images/logo-s.svg';
import MenuIcon from '@material-ui/icons/Menu';

///////////////////////////
// Screens
///////////////////////////

import screens from 'navigation/screens';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';
import commonStyles from './../styles.scss';

///////////////////////////
// Interfaces
///////////////////////////

interface IHomeHeader{
  navigation: any;
  route: any;
  hasMainAccount: boolean;
}

///////////////////////////
// Header
///////////////////////////

const homeHeader = ({
  navigation,
  hasMainAccount
}: IHomeHeader) => {

  const onMenuButtonClicked = () => {
    navigation.navigate(screens.authorized.settings)
  }

  const renderHeaderRight = () => {

    if (hasMainAccount) {
      return (
      <IconButton
        className={`${styles.buttonRight} ${styles.more}`}
        onClick={onMenuButtonClicked}
      >
        <MenuIcon className={styles.buttonRight} />
      </IconButton>)
    }
    // Hack: The header title will not center unless there is 
    // both a headerLeft and headerRight. So we insert an 
    // empty div to meet the requirement.
    return (<div className={commonStyles.emptyDiv}></div>);

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