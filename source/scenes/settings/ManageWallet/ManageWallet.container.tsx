import React, { FC } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';

import { useForm } from 'react-hook-form';
import { useCopyClipboard } from 'hooks/index';
import { getAccountController } from 'utils/controllersUtils';

import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import walletsSelector from 'selectors/walletsSelectors';

import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
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
  const dagAddress =
    wallet?.accounts?.find((account) => account.network === KeyringNetwork.Constellation)
      ?.address || '';
  const ethAddress =
    wallet?.accounts?.find((account) => account.network === KeyringNetwork.Ethereum)
      ?.address || '';

  const onSubmit = (data: any) => {
    accountController.updateWalletLabel(wallet, data.name);
    navigation.goBack();
  };

  const onCancelClicked = () => {
    navigation.goBack();
  };

  const onShowRecoveryPhraseClicked = () => {
    const type = 'phrase';
    linkTo(`/settings/wallets/checkPassword?type=${type}&id=${id}`);
  };

  const onDeleteWalletClicked = () => {
    const type = 'remove';
    linkTo(`/settings/wallets/checkPassword?type=${type}&id=${id}`);
  };

  const onShowPrivateKeyClicked = () => {
    const type = 'privatekey';
    linkTo(`/settings/wallets/checkPassword?type=${type}&id=${id}`);
  };

  if (!wallet) {
    // throws error when deleting Wallet and wallet is undefined
    return null;
  }

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
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
        dagAddress={dagAddress}
        ethAddress={ethAddress}
      />
    </Container>
  );
};

export default ManageWalletContainer;
