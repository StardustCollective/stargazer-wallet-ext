import React from 'react';
import { useSelector } from 'react-redux';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import FullSelect from 'components/FullSelect';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import TxsPanel from './TxsPanel';

import styles from './Home.scss';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { accounts, activeIndex } = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <div className={styles.wrapper}>
      <Header showLogo />
      <section className={styles.account}>
        <FullSelect
          value={String(activeIndex)}
          options={accounts}
          onChange={(val: string) =>
            controller.wallet.switchWallet(Number(val))
          }
        />
      </section>
      <section className={styles.center}>
        <h3>
          {accounts[activeIndex].balance || 0} <small>DAG</small>
        </h3>
        <small>≈ {getFiatAmount(accounts[activeIndex].balance || 0)}</small>
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
      <TxsPanel
        address={accounts[activeIndex].address}
        transactions={accounts[activeIndex].transactions}
      />
    </div>
  );
};

export default Home;
