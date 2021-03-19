import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';

import styles from './GasSettings.scss';

const GasSettings = () => {
  const controller = useController();
  const [config, setConfig] = useState<
    | {
        nonce?: number;
        gas: number;
        gasLimit: number;
        txData?: string;
      }
    | undefined
  >(controller.wallet.account.getTempTx()?.ethConfig);

  useEffect(() => {
    if (!config) {
      controller.wallet.account.getRecommendETHTxConfig().then((val) => {
        setConfig(val);
      });
    }
  }, []);

  const handleUpdate = (key: string, val: any) => {
    if (!config) return;
    setConfig({
      ...config,
      [key]: val,
    });
    controller.wallet.account.updateETHTxConfig({ [key]: val });
  };

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
                value={config?.gas || 0}
                name="gasPrice"
                onChange={(ev) => handleUpdate('gas', ev.target.value)}
              />
            </li>
            <li>
              <label>GAS LIMIT</label>
              <TextInput
                type="number"
                placeholder="Gas Limit"
                fullWidth
                value={config?.gasLimit || 0}
                name="gasLimit"
                onChange={(ev) => handleUpdate('gasLimit', ev.target.value)}
              />
            </li>
            <li>
              <label>Transaction data (optional) 0 bytes</label>
              <TextInput
                placeholder="Transaction data"
                fullWidth
                value={config?.txData || ''}
                name="transactionData"
                onChange={(ev) => handleUpdate('txData', ev.target.value)}
              />
            </li>
            <li>
              <label>Nonce</label>
              <TextInput
                type="number"
                placeholder="Nonce"
                fullWidth
                value={config?.nonce || ''}
                name="nonce"
                onChange={(ev) => handleUpdate('nonce', ev.target.value)}
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
