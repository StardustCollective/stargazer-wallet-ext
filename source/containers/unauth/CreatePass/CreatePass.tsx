import React from 'react';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

import Layout from '../Layout';

import styles from './CreatePass.scss';

const CreatePass = () => {
  return (
    <Layout title={`Let's create a \npassword for your\nkeystore file`}>
      <TextInput
        type="password"
        placeholder="Please enter at least 9 characters"
        fullWidth
        visiblePassword
        variant={styles.pass}
      />
      <TextInput
        type="password"
        placeholder="Please enter your password again"
        fullWidth
        visiblePassword
        variant={styles.repass}
      />
      <span className="body-comment">
        DO NOT FORGET to save your password.
        <br /> You will need this Password + KeyStore File to unlcok your
        wallet.
      </span>
      <Button type="button" variant={styles.next}>
        Next
      </Button>
    </Layout>
  );
};

export default CreatePass;
