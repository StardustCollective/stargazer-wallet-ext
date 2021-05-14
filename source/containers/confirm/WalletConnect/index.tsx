import clsx from 'clsx';
import Button from 'components/Button';
import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/CallMade';
import Checkbox from '@material-ui/core/Checkbox';

import styles from './index.module.scss';

enum ConnectWallet {
  Choose,
  Confirm,
}

const WalletConnect = () => {
  const [step, setStep] = useState(ConnectWallet.Confirm);

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <section className={styles.heading}>
          <img src={styles.logo} />
          <span>https://dag.chad</span>
        </section>
        <div className={styles.title}>
          {step === ConnectWallet.Choose
            ? `Connect With Stargazer Wallet`
            : `Connect to Main Wallet (DAG...1v04)`}
        </div>
        <label>
          {step === ConnectWallet.Choose
            ? `Please select an amount:`
            : `Allows this site to:`}
        </label>
        {step === ConnectWallet.Confirm ? (
          <section className={styles.confirm}>
            <Checkbox color="primary" size="small" checked />
            View the addresses of your permitted accounts (required)
          </section>
        ) : (
          <section className={styles.accounts}>
            <table>
              <tr>
                <td>
                  <Checkbox color="primary" size="small" />
                </td>
                <td>1</td>
                <td>0xb2...a49D</td>
                <td>0.003020 ETH</td>
                <td>
                  <IconButton size="small">
                    <LinkIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            </table>
          </section>
        )}
        <label>Only connect to sites you trust</label>
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

export default WalletConnect;
