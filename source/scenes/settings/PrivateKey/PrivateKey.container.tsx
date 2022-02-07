import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showMessage } from 'react-native-flash-message';

import WalletController from 'scripts/Background/controllers/WalletController';

import Container from 'scenes/common/Container';

import PrivateKey from './PrivateKey';

import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import { useSelector } from 'react-redux';

import { IPrivateKeyView } from './types';

const PrivateKeyContainer: FC<IPrivateKeyView> = ({ route }) => {
  // const { id } = route.params;
  const id = '12313123123213';
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const wallet = wallets.find((w) => w.id === id);

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  // const [isCopied, copyText] = useCopyClipboard();
  const [isCopied, copyText] = useState(false);

  const [checked, setChecked] = useState(false);
  const [privKey, setPrivKey] = useState<string>('*************************************************************');

  const onSubmit = async (data: any) => {
    // const res = await WalletController.getPrivateKey(id, data.password);
    const res = 'private key copy...........';
    console.log('res data', data);

    if (res) {
      setPrivKey(res);
      setChecked(true);
    } else {
      showMessage({
        message: 'Error: Invalid password',
        type: 'danger',
      });
    }
  };

  const handleCopyPrivKey = () => {
    if (!checked) return;
    copyText(privKey);
  };

  return (
    <Container>
      <PrivateKey
        register={register}
        control={control}
        handleCopyPrivKey={handleCopyPrivKey}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        checked={checked}
        isCopied={isCopied}
        wallet={wallet}
        privKey={privKey}
      />
    </Container>
  );
};

export default PrivateKeyContainer;
