import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextInput from 'components/TextInput';
import { useController, useCopyClipboard } from 'hooks/index';
import { ellipsis } from 'containers/auth/helpers';

import styles from './index.scss';

const PrivateKeyView = () => {
  const controller = useController();
  const accountInfo = controller.wallet.account.currentAccount();
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const [isCopied, copyText] = useCopyClipboard();
  const [checked, setChecked] = useState(false);
  const [isCopiedAddress, copyAddress] = useState(false);
  const [privKey, setPrivKey] = useState<string>(
    '*************************************************************'
  );

  const addressClass = clsx(styles.address, {
    [styles.copied]: isCopied && isCopiedAddress,
  });
  const privKeyClass = clsx(styles.privKey, {
    [styles.copied]: isCopied && !isCopiedAddress,
    [styles.notAllowed]: !checked,
  });

  const onSubmit = (data: any) => {
    const res = controller.wallet.account.getPrivKey(data.password);
    if (res) {
      setPrivKey(res);
      setChecked(true);
    }
  };

  const handleCopyPrivKey = () => {
    if (!checked) return;
    copyAddress(false);
    copyText(privKey);
  };

  return (
    <div className={styles.wrapper}>
      {accountInfo && (
        <>
          <div className={styles.heading}>
            <div>Click to copy your public key:</div>
            <span
              className={addressClass}
              onClick={() => {
                copyText(accountInfo.address);
                copyAddress(true);
              }}
            >
              {ellipsis(accountInfo.address)}
            </span>
          </div>
          <div className={styles.content}>
            <span>Please enter your wallet password:</span>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
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
              Warning: Keep your keys secret! Anyone with your private keys can
              steal your assets .
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateKeyView;
