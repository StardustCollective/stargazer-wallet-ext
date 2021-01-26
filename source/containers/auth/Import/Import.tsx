import React from 'react';
import Layout from 'containers/common/Layout';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './Import.scss';

const Import = () => {
  return (
    <Layout title="Let's restore your wallet" linkTo="/app.html">
      <form className={styles.importForm}>
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
          Importing your wallet seed will automatically import a wallet
          associated with this seed phrase.
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

export default Import;
