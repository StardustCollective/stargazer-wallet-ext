import React from 'react';
import clsx from 'clsx';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './index.scss';

const RemoveAccountView = () => {
  return (
    <div className={styles.removeAccount}>
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
          Done
        </Button>
      </div>
      <span>
        This account will be removed from your wallet. Please make sure you have
        the private key for this account before continuing. You can restore this
        account with the ‘Create new account option’.
      </span>
    </div>
  );
};

export default RemoveAccountView;
