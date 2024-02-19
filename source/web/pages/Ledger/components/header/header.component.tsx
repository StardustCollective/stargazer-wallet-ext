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
};

export default Header;
