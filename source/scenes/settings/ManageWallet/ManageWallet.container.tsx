import React, { FC } from 'react';
import Container from 'scenes/common/Container';

import { useForm } from 'react-hook-form';

import IVaultState from 'state/vault/types';
// import { useController } from 'hooks/index';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import { useLinkTo } from '@react-navigation/native';

import ManageWallet from './ManageWallet';

import { IManageWalletView } from './types';

const ManageWalletContainer: FC<IManageWalletView> = ({ route, navigation }) => {
  // const controller = useController();
  const linkTo = useLinkTo();
  // const id = route.params.id;

  const id = '12313123123213';

  const { handleSubmit, register, control } = useForm();
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);

  const wallet = wallets.find((w) => w.id === id);

  const onSubmit = (data: any) => {
    // controller.wallet.account.updateWalletLabel(id, data.name);
    navigation.goBack();
  };

  const onCancelClicked = () => {
    navigation.goBack();
  };

  const onShowRecoveryPhraseClicked = () => {
    linkTo(`/settings/wallets/phrase?id=${id}`);
  };

  const onDeleteWalletClicked = () => {
    linkTo(`/settings/wallets/remove?id=${id}`);
  };

  const onShowPrivateKeyClicked = () => {
    linkTo(`/settings/wallets/privateKey?id=${id}`);
  };

  return (
    <Container>
      <ManageWallet
        walletId={id}
        handleSubmit={handleSubmit}
        register={register}
        control={control}
        wallets={wallets}
        wallet={wallet}
        onSubmit={onSubmit}
        onCancelClicked={onCancelClicked}
        onShowRecoveryPhraseClicked={onShowRecoveryPhraseClicked}
        onDeleteWalletClicked={onDeleteWalletClicked}
        onShowPrivateKeyClicked={onShowPrivateKeyClicked}
      />
    </Container>
  );
};

export default ManageWalletContainer;
