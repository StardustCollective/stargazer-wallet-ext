import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showMessage } from 'react-native-flash-message';

import { getWalletController } from 'utils/controllersUtils';

import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import navigationUtil from 'navigation/util';

import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import Container, { CONTAINER_COLOR } from 'components/Container';

import RemoveWallet from './RemoveWallet';

import { IRemoveWalletView } from './types';

const RemoveWalletContainer: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const walletController = getWalletController();
  const { id } = route.params;
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const wallet = wallets.local.find((w) => w.id === id);
  const isSeedWallet = wallet && wallet.type === KeyringWalletType.MultiChainWallet;

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    const isChecked = await walletController.deleteWallet(id, data.password);
    if (isChecked) {
      if (wallets.local.length === 1) {
        walletController.logOut();
      } else {
        navigationUtil.popToTop(navigation);
      }
    } else {
      showMessage({
        type: 'danger',
        message: 'Error: Invalid password',
      });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <RemoveWallet
        goBack={goBack}
        wallet={wallet}
        isSeedWallet={isSeedWallet}
        handleSubmit={handleSubmit}
        register={register}
        control={control}
        onSubmit={onSubmit}
      />
    </Container>
  );
};

export default RemoveWalletContainer;
