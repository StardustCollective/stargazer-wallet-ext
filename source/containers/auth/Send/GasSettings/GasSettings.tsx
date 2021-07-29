import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';

import styles from './GasSettings.scss';
import { IETHTxConfig } from '../../../../scripts/types';

const GasSettings = () => {
  const controller = useController();
  const history = useHistory();
  const [config, setConfig] = useState<IETHTxConfig>();

  useEffect(() => {
    const ethConfig = controller.wallet.account.getTempTx()?.ethConfig;
    if (!ethConfig) {
      controller.wallet.account.getRecommendETHTxConfig().then((val) => {
        setConfig(val);
      });
    } else {
      setConfig(ethConfig);
    }
  }, []);

  const handleUpdate = (key: string, val: any) => {
    if (!config) return;
    setConfig({
      ...config,
      [key]: val,
    });
  };

  const handleSave = () => {
    if (!config) return;
    controller.wallet.account.updateETHTxConfig(config);
    history.push('/send');
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
                value={config?.gasPrice || 0}
                name="gasPrice"
                onChange={(ev) => handleUpdate('gasPrice', ev.target.value)}
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
            <Button type="button" variant={styles.button} onClick={handleSave}>
              Save
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default GasSettings;
