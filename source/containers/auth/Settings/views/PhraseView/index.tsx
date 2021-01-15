import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextInput from 'components/TextInput';
import { useCopyClipboard } from 'hooks/index';

import styles from './index.scss';

const PhraseView = () => {
  const [checked, setChecked] = useState(false);
  const [isCopied, copyText] = useCopyClipboard();
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const seedClass = clsx(styles.seed, {
    [styles.copied]: isCopied,
    [styles.notAllowed]: !checked,
  });

  const onSubmit = (data: any) => {
    console.log(data.password);
    setChecked(true);
  };

  const handleCopySeed = () => {
    if (!checked) return;
    copyText('Seed phrase');
  };

  return (
    <div className={styles.phrase}>
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
      <span>Click to copy your seed phrase:</span>
      <div className={seedClass} onClick={handleCopySeed}>
        **** ******* ****** ****** ****** ******** *** ***** ****** ***** *****
        ****** ******* ****** *****
      </div>
      <span>
        Warning: Keep your seed phrase secret! Anyone with your seed phrase can
        access any account connected to this wallet and steal your assets.
      </span>
    </div>
  );
};

export default PhraseView;
