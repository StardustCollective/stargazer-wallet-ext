import React from 'react';
import Button from 'components/Button';
import Link from 'components/Link';
import LogoImage from 'assets/images/logo-l.png';

import styles from './Start.scss';

const Start = () => {
  return (
    <div className={styles.home}>
      <h1 className="heading-1 full-width t-white">
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
      <Link color="secondary" to="/app.html">
        Restore account?
      </Link>
      <span className="body-caption t-white">
        Import using account seed phrase
      </span>
    </div>
  );
};

export default Start;
