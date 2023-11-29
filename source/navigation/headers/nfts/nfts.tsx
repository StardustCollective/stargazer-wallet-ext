///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';

///////////////////////////
// Images
///////////////////////////

import LogoImage from 'assets/images/logo.svg';
import RestartIcon from 'assets/images/svg/restart.svg';
import ArrowLeftIcon from 'assets/images/svg/arrow-rounded-left.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';

///////////////////////////
// Header
///////////////////////////

interface INftsHeader {
  navigation: any;
  onRefresh?: () => void;
  showLogo?: boolean;
  showRefresh?: boolean;
}

const nftsHeader = ({
  navigation,
  onRefresh,
  showLogo = true,
  showRefresh = true,
}: INftsHeader) => {
  const renderHeaderRight = () => {
    return (
      <div className={styles.rightIconContainer} onClick={onRefresh}>
        <img src={`/${RestartIcon}`} className={styles.refresh} />
      </div>
    );
  };

  const renderHeaderLeft = () => {
    return (
      <div className={styles.leftIconContainer}>
        <img src={`/${LogoImage}`} className={styles.logo} />
      </div>
    );
  };

  const renderHeaderLeftArrow = () => {
    return (
      <div className={styles.arrowIconContainer} onClick={() => navigation.goBack()}>
        <img src={`/${ArrowLeftIcon}`} className={styles.arrowIcon} />
      </div>
    );
  };

  const headerLeft = showLogo ? renderHeaderLeft : renderHeaderLeftArrow;

  return {
    ...config,
    headerLeft,
    ...(showRefresh ? { headerRight: renderHeaderRight } : {}),
  };
};

export default nftsHeader;
