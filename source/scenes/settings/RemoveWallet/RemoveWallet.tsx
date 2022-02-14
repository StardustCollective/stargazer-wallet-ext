import React, { FC } from 'react';
import clsx from 'clsx';

import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './RemoveWallet.scss';
import IRemoveWalletSettings from './types';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  goBack,
  wallet,
  isSeedWallet,
  handleSubmit,
  register,
  onSubmit,
}) => {
  return (
    <div className={styles.removeAccount}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {wallet && (
          <div className={styles.subheading}>
            <div>Account name:</div>
            <span className={styles.accountName}>{wallet.label}</span>
          </div>
        )}

        <span>Please enter your wallet password:</span>
        <TextInput
          type="password"
          name="password"
          visiblePassword
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <div className={styles.actions}>
          <Button type="button" theme="secondary" variant={clsx(styles.button, styles.close)} onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit" variant={styles.button}>
            Confirm
          </Button>
        </div>
        <span>
          {isSeedWallet && (
            <span>
              This wallet will be removed from Stargazer. You will need to provide the recovery seed phrase in order to
              restore it.
            </span>
          )}
          {!isSeedWallet && (
            <span>
              This account will be removed from Stargazer. You will need to provide the private key in order to restore
              it.
            </span>
          )}
        </span>
      </form>
    </div>
  );
};

export default RemoveWallet;
