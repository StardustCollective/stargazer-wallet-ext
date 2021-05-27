import clsx from 'clsx';
import Button from 'components/Button';
import React from 'react';

import styles from './index.module.scss';
import { useController } from 'hooks/index';
import { browser } from 'webextension-polyfill-ts';

const WalletConnect = () => {

  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

  const handleClose = () => {
    window.close();
  };

  const handleSubmit = async () => {
    controller.dapp.fromUserConnectDApp(origin, current);
    const background = await browser.runtime.getBackgroundPage();

    background.dispatchEvent(
      new CustomEvent('connectWallet', { detail: window.location.hash })
    );

    window.close();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <section className={styles.heading}>
          <img className={styles.logo} src={current.logo} />
          <span>{current.title}</span>
        </section>
        <div className={styles.title}>
          {`Allow this site to\n connect to\n Stargazer Wallet`}
        </div>
        <label>Only connect to sites you trust</label>
        <section className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleSubmit}>
            Connect
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WalletConnect;
