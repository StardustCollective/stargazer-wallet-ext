import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import LogoImage from 'assets/images/logo-m.png';

import styles from './Starter.scss';

const Starter = () => {
  return (
    <div className={styles.home}>
      <h1 className="heading-1 full-width t-white">
        Welcome to
        <br />
        Stargazer Wallet
      </h1>
      <img src={LogoImage} className={styles.logo} alt="Stargazer" />
      <TextInput
        type="password"
        visiblePassword
        fullWidth
        placeholder="Please enter your password"
        variant={styles.password}
      />
      <Button type="submit" theme="secondary" variant={styles.unlock}>
        Unlock
      </Button>
      <span className="body-caption t-teal">Restore account?</span>
      <span className="body-caption t-white">
        Import using account seed phrase
      </span>
    </div>
  );
};

export default Starter;
