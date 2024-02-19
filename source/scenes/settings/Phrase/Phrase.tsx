import React, { FC } from 'react';
import clsx from 'clsx';

import TextInput from 'components/TextInput';

import styles from './Phrase.scss';
import IPhraseSettings from './types';

const Phrase: FC<IPhraseSettings> = ({
  handleSubmit,
  register,
  control,
  onSubmit,
  checked,
  phrase,
  isCopied,
  handleCopySeed,
}) => {
  const seedClass = clsx(styles.seed, {
    [styles.copied]: isCopied,
    [styles.notAllowed]: !checked,
  });

  return (
    <div className={styles.phrase}>
      <span>Please input your wallet password and press enter:</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          control={control}
          id="phrase-password"
          type="password"
          name="password"
          visiblePassword
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
      </form>
      <span>Click to copy your seed phrase:</span>
      <div id="phrase-recoveryPhrase" className={seedClass} onClick={handleCopySeed}>
        {phrase}
      </div>
      <span>
        Warning: Keep your seed phrase secret! Anyone with your seed phrase can access any
        account connected to this wallet and steal your assets.
      </span>
    </div>
  );
};

export default Phrase;
