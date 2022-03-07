import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import NavigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';
import { getWalletController } from 'utils/controllersUtils';
import Container, { CONTAINER_COLOR }from 'components/Container';

import NewAccount from './NewAccount';

import { INewAccountView } from './types';

const NewAccountContainer: FC<INewAccountView> = ({ navigation }) => {
  const walletController = getWalletController();
  const [accountName, setAccountName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState<string>('');

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const id = await walletController.createWallet(data.name);
    setWalletId(id);
    // onChange(id);
    setLoading(false);
    setAccountName(data.name);
  };

  const onClickResetStack = () => {
    NavigationUtil.popToTop(navigation);
  };

  const linkTo = useLinkTo();
  const onShowPhraseClick = () => {
    linkTo(`/settings/wallets/phrase?id=${walletId}`);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <NewAccount
        onClickResetStack={onClickResetStack}
        onShowPhraseClick={onShowPhraseClick}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        register={register}
        control={control}
        accountName={accountName}
        loading={loading}
        walletId={walletId}
      />
    </Container>
  );
};

export default NewAccountContainer;
