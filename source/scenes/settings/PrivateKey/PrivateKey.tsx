import React, { FC } from 'react';
import clsx from 'clsx';

import TextInput from 'components/TextInput';

import styles from './PrivateKey.scss';
import IPrivateKeySettings from './types';

const PrivateKey: FC<IPrivateKeySettings> = ({
  register,
  control,
  handleCopyPrivKey,
  onSubmit,
  handleSubmit,
  checked,
  isCopied,
  wallet,
  privKey,
}) => {
  const privKeyClass = clsx(styles.privKey, {
    [styles.copied]: isCopied,
    [styles.notAllowed]: !checked,
  });

  return (
    <div className={styles.wrapper}>
      {wallet && (
        <>
          <div className={styles.heading}>
            <div>Account name:</div>
            <span className={styles.accountName}>{wallet.label}</span>
          </div>
          <div className={styles.content}>
            <span>Please input your wallet password and press enter:</span>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                control={control}
                type="password"
                name="password"
                visiblePassword
                fullWidth
                inputRef={register}
                variant={styles.input}
              />
            </form>
            <span>Click to copy your private key:</span>
            <div className={privKeyClass} onClick={handleCopyPrivKey}>
              {privKey}
            </div>
            <span>
              Warning: Keep your keys secret! Anyone with your private keys can steal your
              assets .
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateKey;
