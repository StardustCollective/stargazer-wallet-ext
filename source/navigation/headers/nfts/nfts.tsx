///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';

///////////////////////////
// Images
///////////////////////////

import LogoImage from 'assets/images/logo.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';

///////////////////////////
// Header
///////////////////////////

interface INftsHeader {
  onRefresh: () => void;
}

const nftsHeader = ({ onRefresh }: INftsHeader) => {
  return {
    ...config,
    headerLeft: () => (
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
    ),
  };
};

export default nftsHeader;
