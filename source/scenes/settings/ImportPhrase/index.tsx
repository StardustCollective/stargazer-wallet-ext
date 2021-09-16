import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';
import styles from './index.scss';
import navigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';

interface IImportPhrase {
  navigation: any;
}

const ImportPhrase = ({ navigation }: IImportPhrase) => {
  const controller = useController();
  const [loading, setLoading] = useState(false);
  const linkTo = useLinkTo();

  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      phrase: yup.string().required(),
      label: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      
      await controller.wallet.createWallet(data.label, data.phrase.trim());
      navigationUtil.popToTop(navigation);
      linkTo('/settings/wallets');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onCancelClick = () => {
    navigation.goBack();
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <section>
        <label>Recovery Seed Phrase</label>
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
          Typically 12 (sometimes 24) words separated by single spaces
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
          onClick={onCancelClick}
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

export default ImportPhrase;
