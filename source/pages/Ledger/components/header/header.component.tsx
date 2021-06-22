
/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';

/////////////////////////
// Image Imports
/////////////////////////

// import logo from './../../logo.png';
import LogoImage from 'assets/images/logo-s.svg';

/////////////////////////
// Styles
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Constants
/////////////////////////

// Numbers
const LOGO_IMAGE_WIDTH_NUMBER = 150;
const LOGO_IMAGE_HEIGHT_NUMBER = 38;
// Strings
const WALLET_RIGHT_HEADER_STRING = 'Stargazer Wallet';

/////////////////////////
// Component
/////////////////////////

const Header = () => {

  /////////////////////////
  // Render
  /////////////////////////

  return (
    <div className={styles.cardHeader}>
      <div className={styles.leftHeader}>
        <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
        {WALLET_RIGHT_HEADER_STRING}
      </div>
    </div>
  );    

}

export default Header;