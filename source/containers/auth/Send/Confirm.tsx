import React, { useState } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Layout from 'containers/common/Layout';
import Button from 'components/Button';
import { useController } from 'hooks/index';
import CheckIcon from 'assets/images/svg/check.svg';
import RightArrowIcon from 'assets/images/svg/arrow-right.svg';

import { ellipsis } from '../helpers';
import styles from './Confirm.scss';

const SendConfirm = () => {
  const controller = useController();
  const tempTx = controller.wallet.account.getTempTx();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return confirmed ? (
    <Layout title="Your transaction is underway" linkTo="/remind" showLogo>
      <img src={`/${CheckIcon}`} className={styles.checked} alt="Success" />
      <div className="body-description">
        You can follow your transaction under activity on your account screen.
      </div>
      <Button type="button" variant={styles.next} linkTo="/home">
        Next
      </Button>
    </Layout>
  ) : (
    <div className={styles.wrapper}>
      <Header backLink="/send" />
      <section className={styles.heading}>
        <span className={styles.title}>Confirm Transaction</span>
        <div className={styles.path}>
          {ellipsis(tempTx?.fromAddress || '')}
          <img
            src={`/${RightArrowIcon}`}
            alt="arrow"
            className={styles.arrow}
          />
          {ellipsis(tempTx?.toAddress || '')}
        </div>
      </section>
      <section className={styles.transaction}>
        <div className={styles.row}>
          Address:
          <span>{ellipsis(tempTx?.toAddress || '')}</span>
        </div>
        <div className={styles.row}>
          Amount:
          <div className={styles.amount}>
            <span>
              {tempTx?.amount || 0}
              <small>DAG</small>
            </span>
            <span className={styles.cash}>$2,000.75 USD</span>
          </div>
        </div>
        <div className={styles.row}>
          Transaction Fee:
          <span>{tempTx?.fee || 0} DAG</span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Total:
          <div className={styles.amount}>
            <span>
              {(tempTx?.amount || 0) + (tempTx?.fee || 0)}
              <small>DAG</small>
            </span>
            <span className={styles.cash}>$2,000.75 USD</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            linkTo="/send"
          >
            Close
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SendConfirm;
