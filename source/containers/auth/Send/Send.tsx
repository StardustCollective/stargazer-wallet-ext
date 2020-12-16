import React, { ChangeEvent, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import CloseIcon from 'assets/images/svg/close.svg';
import VerifiedIcon from 'assets/images/svg/check-green.svg';

import styles from './Send.scss';

const WalletSend = () => {
  const [address, setAddress] = useState('');

  const tempVerifyAddress = useMemo(() => {
    if (address.length >= 3 && address.length <= 6) {
      return true;
    }
    return false;
  }, [address]);

  const addressInputClass = clsx(styles.input, styles.address, {
    [styles.verified]: tempVerifyAddress,
  });
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !tempVerifyAddress,
  });

  const handleAddressOption = () => {
    if (address) {
      setAddress('');
    }
  };

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress(ev.target.value);
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.heading}>
        <span className={styles.title}>Send DAG</span>
        <span className={styles.label}>Address:</span>
        <div className={styles.inputWrapper}>
          <img src={VerifiedIcon} alt="checked" className={statusIconClass} />
          <TextInput
            placeholder="Enter a valid DAG address"
            fullWidth
            value={address}
            onChange={handleAddressChange}
            variant={addressInputClass}
          />
          <Button
            type="button"
            variant={styles.qrcode}
            onClick={handleAddressOption}
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
