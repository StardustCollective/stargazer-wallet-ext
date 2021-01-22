import React from 'react';
import Layout from 'containers/common/Layout';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './Restore.scss';

const Restore = () => {
  return (
    <Layout title="Let's restore your wallet" linkTo="/app.html">
      <form className={styles.restoreForm}>
        <span className={styles.password}>
          Please enter your wallet password:
        </span>
        <TextInput
          type="password"
          name="password"
          visiblePassword
          fullWidth
          variant={styles.input}
        />
        <span>Paste your wallet seed phrase below:</span>
        <TextInput
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          variant={styles.input}
        />
        <span>
          Restoring your wallet seed will automatically restore any BTC, ETH,
          DAG accounts / assets associated with this seed phrase and that have
          actively been used.
        </span>
        <div className={styles.actions}>
          <Button type="submit" variant={styles.button}>
            Restore
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default Restore;
