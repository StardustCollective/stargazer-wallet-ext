import styles from './index.module.scss';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from 'components/Button';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import { AssetType } from '../../../state/vault/types';

const SignatureRequest = () => {
  const controller = useController();
  const { windowId, data: stringData } = queryString.parse(location.search);
  const params = JSON.parse(stringData as string);
  const account = controller.stargazerProvider.getAssetByType(AssetType.Constellation);
  const balance = controller.stargazerProvider.getBalance();


  const handleCancel = async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('messageSigned', { detail: { windowId, result: false } })
    );
    window.close();
  };

  useEffect(() => { }, []);

  const handleSign = async () => {
    const signature = controller.stargazerProvider.signMessage(params.message);

    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('messageSigned', { detail: { windowId, result: true, signature } })
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
            <span>{balance} DAG</span>
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
