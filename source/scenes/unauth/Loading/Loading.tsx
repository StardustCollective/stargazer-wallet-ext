import React from 'react';
import LogoImage from 'assets/images/logo.svg';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './Loading.scss';

const Loading = () => {
  return (
    <div className={styles.home}>
      <TextV3.HeaderLargeRegular
        align={TEXT_ALIGN_ENUM.CENTER}
        extraStyles={styles.title}
      >
        Welcome to <TextV3.HeaderLarge>Stargazer Wallet</TextV3.HeaderLarge>
      </TextV3.HeaderLargeRegular>
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
      <CircularProgress className={styles.loader} />
    </div>
  );
};

export default Loading;
