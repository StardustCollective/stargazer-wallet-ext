import React from 'react';
import clsx from 'clsx';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './index.scss';

const DeleteWalletView = () => {
  return (
    <div className={styles.deleteWallet}>
      <span>
        <b>Warning:</b> this action will delete your wallet and all accounts
        associated with this wallet. Please make sure to back up your Wallet
        seed phase if you would like to access this wallet and associated
        accounts in the future.
      </span>
      <span>Please enter your wallet password:</span>
      <TextInput
        type="password"
        name="password"
        visiblePassword
        fullWidth
        variant={styles.input}
      />
      <div className={styles.actions}>
        <Button
          type="button"
          theme="secondary"
          variant={clsx(styles.button, styles.close)}
        >
          Close
        </Button>
        <Button type="submit" variant={styles.button}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteWalletView;
