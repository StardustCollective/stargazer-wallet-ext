import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController, useSettingsView } from 'hooks/index';
import styles from './index.scss';
import { WALLETS_VIEW } from '../routes';

const ImportPhraseView = () => {
  const showView = useSettingsView();
  const controller = useController();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      phrase: yup.string().required(),
      label: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      //await controller.wallet.importPhrase(data.phrase);
      await controller.wallet.createWallet(data.label, data.phrase);
      showView(WALLETS_VIEW);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <section>
        <label>Seed Phrase</label>
        <TextInput
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <span>
          Typically 12 (sometimes 24) words seperated by single spaces
        </span>
        <label>Name</label>
        <TextInput
          fullWidth
          inputRef={register}
          name="label"
          disabled={loading}
        />
      </section>
      <section className={styles.actions}>
        <Button
          type="button"
          theme="secondary"
          variant={styles.cancel}
          onClick={() => showView(WALLETS_VIEW)}
        >
          Cancel
        </Button>
        <Button type="submit" variant={styles.button} loading={loading}>
          Import
        </Button>
      </section>
    </form>
  );
};

export default ImportPhraseView;
