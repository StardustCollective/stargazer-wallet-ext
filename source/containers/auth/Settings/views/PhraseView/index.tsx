import React, { useState } from 'react';
import clsx from 'clsx';
import TextInput from 'components/TextInput';
import { useCopyClipboard } from 'hooks/index';

import styles from './index.scss';

const PhraseView = () => {
  const [checked, setChecked] = useState(true);
  const [isCopied, copyText] = useCopyClipboard();
  const seedClass = clsx(styles.seed, {
    [styles.copied]: isCopied,
    [styles.notAllowed]: !checked,
  });

  const handleCopySeed = () => {
    if (!checked) return;
    copyText('Seed phrase');
  };

  return (
    <div className={styles.phrase}>
      <span>Please enter your wallet password:</span>
      <TextInput
        type="password"
        visiblePassword
        fullWidth
        variant={styles.input}
      />
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
