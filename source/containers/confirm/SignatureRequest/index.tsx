import styles from './index.module.scss';
import React from 'react';
import clsx from 'clsx';
import Button from 'components/Button';

const SignatureRequest = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <section className={styles.heading}>Signature Request</section>
        <section className={styles.content}>
          <div className={styles.row}>
            <span>Account:</span>
            <span>Balance:</span>
          </div>
          <div className={styles.row}>
            <span>Main Wallet</span>
            <span>555.55 DAG</span>
          </div>
        </section>
        <div className={styles.row}>
          <span>Origin:</span>
          <span>https://dag.chad</span>
        </div>
        <label>You are signing:</label>
        <section className={styles.message}>
          <span>Message:</span>I am buying 27,000 DAG for 3,000 USD
        </section>
        <section className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
          >
            Close
          </Button>
          <Button type="submit" variant={styles.button}>
            Next
          </Button>
        </section>
      </div>
    </div>
  );
};

export default SignatureRequest;
