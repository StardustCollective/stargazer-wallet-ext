import React from 'react';
import Button from 'components/Button';
import Link from 'components/Link';
import PrivateKeyIcon from 'assets/images/svg/key.svg';

import Layout from '../Layout';

import styles from './CreateWallet.scss';

const CreateWallet = () => {
  return (
    <Layout title={`Let's create a new\nStargazer Wallet`}>
      <Button
        type="button"
        fullWidth
        blockHeight={156}
        variant={styles.keystore}
        linkTo="/unauth/create/pass"
      >
        Keystore File
      </Button>
      <Button type="button" fullWidth blockHeight={156} variant={styles.key}>
        <img src={`/${PrivateKeyIcon}`} alt="Import" />
        Private Key
      </Button>
      <Link to="#">Already have a wallet? Click here</Link>
    </Layout>
  );
};

export default CreateWallet;
