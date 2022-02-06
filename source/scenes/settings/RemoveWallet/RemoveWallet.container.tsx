import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showMessage } from 'react-native-flash-message';

import WalletController from 'scripts/Background/controllers/WalletController';

import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import navigationUtil from 'navigation/util';

import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import Container from 'scenes/common/Container';

import RemoveWallet from './RemoveWallet';

import { IRemoveWalletView } from './types';

const RemoveWalletContainer: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const history = useHistory();
  const { id } = route.params;
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const wallet = wallets.find((w) => w.id === id);
  const isSeedWallet = wallet && wallet.type === KeyringWalletType.MultiChainWallet;

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    const isChecked = await WalletController.deleteWallet(id, data.password);
    if (isChecked) {
      if (wallets.length === 1) {
        WalletController.logOut();
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
    history.goBack();
  };

  return (
    <Container>
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
