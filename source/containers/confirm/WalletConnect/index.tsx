import clsx from 'clsx';
import Button from 'components/Button';
import React from 'react';

import styles from './index.module.scss';
import { useController } from 'hooks/index';

const WalletConnect = () => {
  // @ts-ignore
  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current.uri && new URL(current.uri as string).origin;

  const handleClose = () => {
    window.close();
  };

  const handleSubmit = () => {
    controller.dapp.connectDApp(origin, current);
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
