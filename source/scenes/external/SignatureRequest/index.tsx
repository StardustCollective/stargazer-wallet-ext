import styles from './index.module.scss';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Button from 'components/Button';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import { AssetType } from '../../../state/vault/types';
import walletsSelectors from 'selectors/walletsSelectors'

const SignatureRequest = () => {
  const controller = useController();
  const wallets = useSelector(walletsSelectors.selectAllAccounts);
  const { windowId, data: stringData } = queryString.parse(location.search);
  const { origin, signatureRequestEncoded }:
    { origin: string, signatureRequestEncoded: string } = JSON.parse(stringData as string);
  const account = controller.stargazerProvider.getAssetByType(AssetType.Constellation);
  const balance = controller.stargazerProvider.getBalance();

  const signatureRequest = JSON.parse(window.atob(signatureRequestEncoded));

  const handleCancel = async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('messageSigned', { detail: { windowId, result: false } })
    );
    window.close();
  };

  useEffect(() => { }, []);

  const handleSign = async () => {
    const signature = controller.stargazerProvider.signMessage(signatureRequestEncoded);

    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('messageSigned', {
        detail: {
          windowId, result: true, signature: {
            hex: signature,
            requestEncoded: signatureRequestEncoded
          }
        }
      })
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
            <span>{wallets.find(w => w.address === account.address)?.label ?? account.address}</span>
            <span>{balance} DAG</span>
          </div>
        </section>
        <div className={styles.row}>
          <span>Origin:</span>
          <span>{origin}</span>
        </div>
        <label>You are signing:</label>
        <section className={styles.message}>
          <span>Message:</span>
          <div className={styles.content}>
            {signatureRequest.content}
          </div>
        </section>
        {Object.keys(signatureRequest.metadata).length > 0 && <>
          <label>With metadata:</label>
          <section className={styles.metadata}>
            {Object.entries(signatureRequest.metadata).map(
              ([key, value]) => (<small>{key} = {value}</small>)
            )}
          </section>
        </>}
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
