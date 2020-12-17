import React from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import RightArrowIcon from 'assets/images/svg/arrow-right.svg';

import styles from './Confirm.scss';

const SendConfirm = () => {
  return (
    <div className={styles.wrapper}>
      <Header backLink="/send" />
      <section className={styles.heading}>
        <span className={styles.title}>Confirm Transaction</span>
        <div className={styles.path}>
          DAG53v6…d5Ym
          <img
            src={`/${RightArrowIcon}`}
            alt="arrow"
            className={styles.arrow}
          />
          DAG3yp6…vNHP
        </div>
      </section>
      <section className={styles.transaction}>
        <div className={styles.row}>
          Address:
          <span>DAG3yp6…vNHP</span>
        </div>
        <div className={styles.row}>
          Amount:
          <div className={styles.amount}>
            <span>
              100000
              <small>DAG</small>
            </span>
            <span className={styles.cash}>$2,000.75 USD</span>
          </div>
        </div>
        <div className={styles.row}>
          Transaction Fee:
          <span>1 DAG</span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Total:
          <div className={styles.amount}>
            <span>
              100000
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
          <Button type="submit" variant={styles.button}>
            Send
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SendConfirm;
