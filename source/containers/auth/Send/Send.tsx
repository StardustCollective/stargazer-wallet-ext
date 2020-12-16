import React from 'react';
import Header from 'containers/common/Header';
import TextInput from 'components/TextInput';

import styles from './Send.scss';

const WalletSend = () => {
  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.heading}>
        <span className={styles.title}>Send DAG</span>
        <span className={styles.label}>Address:</span>
        <TextInput
          placeholder="Enter a valid DAG address"
          fullWidth
          variant={styles.input}
        />
      </section>
      <section className={styles.content}>
        <span className={styles.label}>Amount:</span>
        <TextInput
          placeholder="Enter amount to send"
          fullWidth
          variant={styles.input}
        />
        <span className={styles.label}>Transaction Fee:</span>
        <TextInput
          placeholder="Enter $DAG transaction fee"
          fullWidth
          variant={styles.input}
        />
      </section>
    </div>
  );
};

export default WalletSend;
