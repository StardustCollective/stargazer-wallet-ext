import React, { ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import CloseIcon from 'assets/images/svg/close.svg';

import styles from './Send.scss';

const WalletSend = () => {
  const [address, setAddress] = useState('');

  const handleAddress = () => {
    if (address) {
      setAddress('');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.heading}>
        <span className={styles.title}>Send DAG</span>
        <span className={styles.label}>Address:</span>
        <div className={styles.inputWrapper}>
          <TextInput
            placeholder="Enter a valid DAG address"
            fullWidth
            value={address}
            onChange={(
              ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setAddress(ev.target.value)}
            variant={clsx(styles.input, styles.address)}
          />
          <Button
            type="button"
            variant={styles.qrcode}
            onClick={() => handleAddress()}
          >
            {address ? (
              <img src={CloseIcon} alt="close" />
            ) : (
              <img src={QRCodeIcon} alt="qr-code" />
            )}
          </Button>
        </div>
      </section>
      <section className={styles.content}>
        <span className={clsx(styles.label, styles.balance)}>
          Amount:
          <small>Balance: 1,000,000 DAG</small>
        </span>
        <div className={styles.inputWrapper}>
          <TextInput
            type="number"
            placeholder="Enter amount to send"
            fullWidth
            variant={clsx(styles.input, styles.amount)}
          />
          <Button type="button" variant={styles.max}>
            Max
          </Button>
        </div>
        <span className={styles.label}>Transaction Fee:</span>
        <TextInput
          type="number"
          placeholder="Enter $DAG transaction fee"
          fullWidth
          variant={styles.input}
        />
        <div className={styles.description}>
          Due to current network conditions we recommend a fee of 0 DAG.
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            linkTo="/home"
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

export default WalletSend;
