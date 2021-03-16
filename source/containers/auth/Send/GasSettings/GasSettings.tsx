import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';

import styles from './GasSettings.scss';

const GasSettings = () => {
  const controller = useController();
  const [config, setConfig] = useState<{
    nonce: number;
    gas: number;
    gasLimit: number;
    txData: string;
  }>();
  useEffect(() => {
    controller.wallet.account.getRecommendETHTxConfig().then((val) => {
      console.log(val);
      setConfig(val);
    });
  }, []);

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
                type="number"
                placeholder="Gas Price"
                fullWidth
                defaultValue={config?.gas || 0}
                name="gasPrice"
              />
            </li>
            <li>
              <label>GAS LIMIT</label>
              <TextInput
                type="number"
                placeholder="Gas Limit"
                fullWidth
                defaultValue={config?.gasLimit || 0}
                name="gasLimit"
              />
            </li>
            <li>
              <label>Transaction data (optional) 0 bytes</label>
              <TextInput
                placeholder="Transaction data"
                fullWidth
                defaultValue={config?.txData || ''}
                name="transactionData"
              />
            </li>
            <li>
              <label>Nonce</label>
              <TextInput
                type="number"
                placeholder="Nonce"
                fullWidth
                defaultValue={config?.nonce || ''}
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
