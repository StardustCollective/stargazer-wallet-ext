import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showMessage } from 'react-native-flash-message';
import { useLinkTo } from '@react-navigation/native';
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
  const allWallets = [...wallets.local, ...wallets.bitfi, ...wallets.ledger];
  const wallet = allWallets.find((w) => w.id === id);
  const isSeedWallet = wallet && wallet.type === KeyringWalletType.MultiChainWallet;
  const linkTo = useLinkTo();

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    const isChecked = await walletController.deleteWallet(wallet, data.password);
    if (isChecked) {
      if (allWallets.length === 1) {
       await  walletController.logOut();
       linkTo('/unAuthRoot');
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
