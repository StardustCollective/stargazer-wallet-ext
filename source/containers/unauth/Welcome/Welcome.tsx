import React from 'react';
import Button from 'components/Button';
import Link from 'components/Link';
import CreateWalletIcon from 'assets/images/svg/create.svg';
import ImportWalletIcon from 'assets/images/svg/wallet.svg';

import styles from './Welcome.scss';

const WelcomeWallet = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.heading}>
        <span className="heading-1 t-purple">
          Welcome to
          <br /> Stargazer Wallet
        </span>
      </section>
      <section className={styles.content}>
        <Button
          type="button"
          fullWidth
          blockHeight={156}
          variant={styles.create}
        >
          <img src={`/${CreateWalletIcon}`} alt="Create" />
          Create New Wallet
        </Button>
        <Button
          type="button"
          fullWidth
          blockHeight={156}
          variant={styles.import}
        >
          <img src={`/${ImportWalletIcon}`} alt="Import" />
          Import Wallet
        </Button>
        <Link to="#">Create or process offline transaction</Link>
      </section>
    </div>
  );
};

export default WelcomeWallet;
