import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import { getWalletController } from 'utils/controllersUtils';
import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import Container, { CONTAINER_COLOR } from 'components/Container';
import RemoveWallet from './RemoveWallet';
import { IRemoveWalletView } from './types';
import localStorage from 'utils/localStorage';

const RemoveWalletContainer: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const walletController = getWalletController();
  const { id } = route.params;
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const allWallets = [...wallets.local, ...wallets.bitfi, ...wallets.ledger];
  const wallet = allWallets.find((w) => w.id === id);
  const linkTo = useLinkTo();
  const [loading, setLoading] = useState(false);

  const handleRemoveWallet = async () => {
    setLoading(true);
    await walletController.deleteWallet(wallet);
    if (allWallets.length === 1) {
      await walletController.logOut();
      await localStorage.removeItem('stargazer-vault');
      walletController.getEncryptedVault();
      walletController.onboardHelper.reset();
      linkTo('/unAuthRoot');
    } else {
      navigation.goBack();
      navigation.goBack();
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <RemoveWallet
        wallet={wallet}
        loading={loading}
        handleCancel={handleCancel}
        handleRemoveWallet={handleRemoveWallet}
      />
    </Container>
  );
};

export default RemoveWalletContainer;
