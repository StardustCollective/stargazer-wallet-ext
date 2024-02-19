import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showMessage } from 'react-native-flash-message';

import { getWalletController } from 'utils/controllersUtils';
import { useCopyClipboard } from 'hooks/index';

import { useSelector } from 'react-redux';

import Container from 'components/Container';

import walletsSelectors from 'selectors/walletsSelectors';
import PrivateKey from './PrivateKey';

import { IPrivateKeyView } from './types';

const PrivateKeyContainer: FC<IPrivateKeyView> = ({ route }) => {
  const walletController = getWalletController();
  const { id } = route.params;
  const allWallets = useSelector(walletsSelectors.selectAllWallets);
  const wallet = allWallets.find((w) => w.id === id);

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const [isCopied, copyText] = useCopyClipboard();
  const [checked, setChecked] = useState(false);
  const [privKey, setPrivKey] = useState<string>(
    '*************************************************************'
  );

  const onSubmit = async (data: any) => {
    const res = await walletController.getPrivateKey(id, data.password);

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
