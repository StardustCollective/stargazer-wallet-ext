import React, { FC } from 'react';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

import styles from './ImportPhrase.scss';
import IImportPhraseSettings from './types';

const ImportPhrase: FC<IImportPhraseSettings> = ({
  loading,
  onCancelClick,
  handleSubmit,
  onSubmit,
  register,
  control,
}) => {
  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <section>
        <label>Recovery Seed Phrase</label>
        <TextInput
          control={control}
          id="importPhrase-phraseInput"
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <span>Typically 12 (sometimes 24) words separated by single spaces</span>
        <label>Name</label>
        <TextInput id="importPhrase-nameInput" fullWidth inputRef={register} name="label" disabled={loading} />
      </section>
      <section className={styles.actions}>
        <Button
          id="importPhrase-cancelButton"
          type="button"
          theme="secondary"
          variant={styles.cancel}
          onClick={onCancelClick}
        >
          Cancel
        </Button>
        <Button id="importPhrase-importButton" type="submit" variant={styles.button} loading={loading}>
          Import
        </Button>
      </section>
    </form>
  );
};

export default ImportPhrase;
