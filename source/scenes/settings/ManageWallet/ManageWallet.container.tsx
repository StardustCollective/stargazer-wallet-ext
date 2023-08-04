import React, { FC } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';

import { useForm } from 'react-hook-form';
import { useCopyClipboard } from 'hooks/index';
import { getAccountController } from 'utils/controllersUtils';

import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import walletsSelector from 'selectors/walletsSelectors';

import ManageWallet from './ManageWallet';

import { IManageWalletView } from './types';

const ManageWalletContainer: FC<IManageWalletView> = ({ route, navigation }) => {
  const accountController = getAccountController();
  const [isCopied, copyText] = useCopyClipboard();
  const linkTo = useLinkTo();
  const { id } = route.params;

  const { handleSubmit, register, control, watch } = useForm();
  const allWallets = useSelector(walletsSelector.selectAllWallets);
  const wallet = allWallets.find((w) => w.id === id);

  const onSubmit = (data: any) => {
    accountController.updateWalletLabel(wallet, data.name);
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

  if (!wallet) {
    // throws error when deleting Wallet and wallet is undefined
    return null;
  }

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <ManageWallet
        walletId={id}
        handleSubmit={handleSubmit}
        register={register}
        watch={watch}
        control={control}
        wallet={wallet}
        onSubmit={onSubmit}
        isCopied={isCopied}
        copyText={copyText}
        onCancelClicked={onCancelClicked}
        onShowRecoveryPhraseClicked={onShowRecoveryPhraseClicked}
        onDeleteWalletClicked={onDeleteWalletClicked}
        onShowPrivateKeyClicked={onShowPrivateKeyClicked}
      />
    </Container>
  );
};

export default ManageWalletContainer;
