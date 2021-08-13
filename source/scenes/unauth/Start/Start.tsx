import React from 'react';
import Button from 'components/Button';
import Link from 'components/Link';
import LogoImage from 'assets/images/logo.svg';
import { useLinkTo } from '@react-navigation/native';

import styles from './Start.scss';

const Start = () => {
  const linkTo = useLinkTo();

  const onImportClicked = () => {
    linkTo('/import')
  }

  return (
    <div className={styles.home}>
      <h1 className="heading-1 full-width t-quicksand t-white tw-medium">
        Welcome to
        <br />
        Stargazer Wallet
      </h1>
      <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
      <Button
        type="submit"
        theme="secondary"
        variant={styles.started}
        linkTo="/create/pass"
      >
        Get started
      </Button>
      <Link color="secondary" onClick={onImportClicked}>
        Import from recovery seed phrase
      </Link>
    </div>
  );
};

export default Start;
