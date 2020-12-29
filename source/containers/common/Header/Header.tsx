import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from 'components/Link';
import Settings from 'containers/auth/Settings';
import { useController } from 'hooks/index';
import LogoImage from 'assets/images/logo-s.png';

import styles from './Header.scss';

interface IHeader {
  backLink?: string;
  showLogo?: boolean;
}

const Header: FC<IHeader> = ({ showLogo = false, backLink = '#' }) => {
  const history = useHistory();
  const controller = useController();
  const isUnlocked = !controller.wallet.isLocked();
  const [showed, showSettings] = useState(false);

  const backHandler = () => {
    showSettings(false);
    if (backLink === '#') {
      history.goBack();
    } else {
      history.push(backLink);
    }
  };

  return (
    <div className={styles.header}>
      {showLogo ? (
        <Link to="/app.html" onClick={() => showSettings(false)}>
          <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
        </Link>
      ) : (
        <IconButton
          className={`${styles.button} ${styles.back}`}
          onClick={backHandler}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <span className={styles.title}>Stargazer Wallet</span>
      <IconButton
        className={`${styles.button} ${styles.more}`}
        onClick={() => showSettings(!showed)}
      >
        <MoreVertIcon />
      </IconButton>
      <Settings open={showed && isUnlocked} />
    </div>
  );
};

export default Header;
