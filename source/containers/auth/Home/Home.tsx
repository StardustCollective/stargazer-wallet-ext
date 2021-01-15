import React from 'react';
import Header from 'containers/common/Header';

import Button from 'components/Button';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';

import styles from './Home.scss';
import TxsPanel from './TxsPanel';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const accountInfo = controller.wallet.account.currentAccount();

  return (
    <div className={styles.wrapper}>
      <Header showLogo />
      <section className={styles.account}>Main Wallet</section>
      <section className={styles.center}>
        <h3>
          {accountInfo?.balance || 0} <small>DAG</small>
        </h3>
        <small>≈ {getFiatAmount(accountInfo?.balance || 0)}</small>
        <div className={styles.actions}>
          <Button
            type="button"
            theme="primary"
            variant={styles.button}
            linkTo="/send"
          >
            Send
          </Button>
          <Button
            type="button"
            theme="primary"
            variant={styles.button}
            linkTo="/receive"
          >
            Receive
          </Button>
        </div>
      </section>
      {accountInfo && (
        <TxsPanel
          address={accountInfo.address}
          transactions={accountInfo.transactions}
        />
      )}
    </div>
  );
};

export default Home;
