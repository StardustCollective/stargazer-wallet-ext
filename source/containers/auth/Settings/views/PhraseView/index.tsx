import TextInput from 'components/TextInput';
import React from 'react';

import styles from './index.scss';

const PhraseView = () => {
  return (
    <div className={styles.phrase}>
      <span>Please enter your wallet password:</span>
      <TextInput type="password" visiblePassword fullWidth />
      <span>Click to copy your seed phrase:</span>
      <div className={styles.seed}>Seed phrase</div>
      <span>
        Warning: Keep your seed phrase secret! Anyone with your seed phrase can
        access any account connected to this wallet and steal your assets.
      </span>
    </div>
  );
};

export default PhraseView;
