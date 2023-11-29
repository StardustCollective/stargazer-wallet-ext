///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////////
// Utils
///////////////////////////

import { useLinkTo } from '@react-navigation/native';
import NavigationUtil from 'navigation/util';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import NewAccount from './NewAccount';

///////////////////////////
// Types
///////////////////////////

import { INewAccountView } from './types';

const NewAccountContainer: FC<INewAccountView> = ({ navigation }) => {
  const linkTo = useLinkTo();

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    linkTo(`/create/phrase/generated?walletName=${data.name}&resetAll=${false}`);
  };

  const onClickResetStack = () => {
    NavigationUtil.popToTop(navigation);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} maxHeight>
      <NewAccount
        onClickResetStack={onClickResetStack}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        register={register}
        control={control}
      />
    </Container>
  );
};

export default NewAccountContainer;
