import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from 'components/Link';
import LogoImage from 'assets/images/logo-s.png';

import styles from './Header.scss';

interface IHeader {
  showLogo?: boolean;
}

const Header: FC<IHeader> = ({ showLogo = false }) => {
  const history = useHistory();

  return (
    <div className={styles.header}>
      {showLogo ? (
        <Link to="/app.html">
          <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
        </Link>
      ) : (
        <IconButton
          className={`${styles.button} ${styles.back}`}
          onClick={() => history.goBack()}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <span className={styles.title}>Stargazer Wallet</span>
      <IconButton className={`${styles.button} ${styles.more}`}>
        <MoreVertIcon />
      </IconButton>
    </div>
  );
};

export default Header;
