import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import navigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';

import WalletController from 'scripts/Background/controllers/WalletController';

import Container from 'scenes/common/Container';

import ImportPhrase from './ImportPhrase';

import { IImportPhraseView } from './types';

const ImportPhraseContainer = ({ navigation }: IImportPhraseView) => {
  const [loading, setLoading] = useState(false);
  const linkTo = useLinkTo();

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      phrase: yup.string().required(),
      label: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      await WalletController.createWallet(data.label, data.phrase.trim());
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
    <Container>
      <ImportPhrase
        loading={loading}
        setLoading={setLoading}
        handleSubmit={handleSubmit}
        control={control}
        register={register}
        onSubmit={onSubmit}
        onCancelClick={onCancelClick}
      />
    </Container>
  );
};

export default ImportPhraseContainer;
