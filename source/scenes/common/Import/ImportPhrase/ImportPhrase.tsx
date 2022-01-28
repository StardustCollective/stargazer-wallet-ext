import React, { FC } from 'react';

import Layout from 'scenes/common/Layout';
import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './ImportPhrase.scss';


import IImportPhrase from './types';


const ImportPhrase: FC<IImportPhrase> = ({ 
  handleSubmit,
  register,
  onSubmit,
  isInvalid,
  isDisabled,
 }) => {

  console.log(isValid);

  return (
    <Layout title="Let's import your wallet">
      <form className={styles.importForm} onSubmit={handleSubmit(onSubmit)}>

        <span>Paste your recovery seed phrase below:</span>
        <TextInput
          id={'recoveryPhraseInput'}
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <span>

          <b>The phrase can be 12, 15, 18, 21 or 24 words with a single space between.</b>
          <br />
          {isInvalid && (
            <span id='seedPhraseError' className={styles.error}>Invalid recovery seed phrase</span>
          )}
        </span>
        <div className={styles.actions}>
          <Button id={'recoveryPhraseSubmit'} type="submit" variant={styles.button} disabled={isDisabled}>
            Import
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default ImportPhrase;
