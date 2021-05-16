import styles from './index.module.scss';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from 'components/Button';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks';
import IWalletState from 'state/wallet/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';

const SignatureRequest = () => {
  const controller = useController();
  const params = controller.dapp.getSigRequest();
  const { accounts }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const account = Object.values(accounts).filter(
    (account) => account.address.constellation === params.address
  )[0];

  const handleCancel = () => {
    window.close();
  };

  useEffect(() => {}, []);

  const handleSign = async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('sign', { detail: window.location.hash })
    );
    window.close();
  };

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
            <span>{account.label}</span>
            <span>{account.balance} DAG</span>
          </div>
        </section>
        <div className={styles.row}>
          <span>Origin:</span>
          <span>{params.origin}</span>
        </div>
        <label>You are signing:</label>
        <section className={styles.message}>
          <span>Message:</span>
          {params.message}
        </section>
        <section className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleSign}>
            Sign
          </Button>
        </section>
      </div>
    </div>
  );
};

export default SignatureRequest;
