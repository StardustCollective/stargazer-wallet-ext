///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import configs from '../configs';

///////////////////////////
// Styles
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import LogoImage from 'assets/images/logo-s.svg';
import MenuIcon from '@material-ui/icons/Menu';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';
import commonStyles from './../styles.scss';

///////////////////////////
// Header
///////////////////////////

const homeHeader = ({
  navigation, 
  route,
  hasMainAccount
}) => {

  const onMenuButtonClicked = () => {
    // Navigate to the Setting screen
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
    ...configs,
    headerLeft: () => (
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
    ),
    headerRight: () => renderHeaderRight(),
  }
};

export default homeHeader;