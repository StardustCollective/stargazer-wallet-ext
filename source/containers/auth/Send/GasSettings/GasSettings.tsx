import React from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

import styles from './GasSettings.scss';
const GasSettings = () => {
  return (
    <div className={styles.wrapper}>
      <Header backLink="/send" />
      <form className={styles.bodywrapper}>
        <section className={styles.subheading}>Advanced Gas Settings</section>
        <section className={styles.content}>
          <ul className={styles.form}>
            <li>
              <label>GAS PRICE (Gwei)</label>
              <TextInput
                placeholder="Gas Price"
                fullWidth
                value="150,7000000000"
                name="gasPrice"
              />
            </li>
            <li>
              <label>GAS LIMIT</label>
              <TextInput
                placeholder="Gas Limit"
                fullWidth
                value="21000"
                name="gasLimit"
              />
            </li>
            <li>
              <label>Transaction data (optional) 0 bytes</label>
              <TextInput
                placeholder="Transaction data"
                fullWidth
                value="0x"
                name="transactionData"
              />
            </li>
            <li>
              <label>Nonce</label>
              <TextInput
                placeholder="Nonce"
                fullWidth
                value="315"
                name="nonce"
              />
            </li>
          </ul>
        </section>
        <section className={styles.actionGroup}>
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              linkTo="/home"
            >
              Cancel
            </Button>
            <Button type="submit" variant={styles.button}>
              Next
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};
export default GasSettings;
