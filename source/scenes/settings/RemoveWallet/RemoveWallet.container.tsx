import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import { getWalletController } from 'utils/controllersUtils';
import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import navigationUtil from 'navigation/util';
import Container, { CONTAINER_COLOR } from 'components/Container';
import RemoveWallet from './RemoveWallet';
import { IRemoveWalletView } from './types';

const RemoveWalletContainer: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const walletController = getWalletController();
  const { id } = route.params;
  const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const allWallets = [...wallets.local, ...wallets.bitfi, ...wallets.ledger];
  const wallet = allWallets.find((w) => w.id === id);
  const linkTo = useLinkTo();

  const handleRemoveWallet = async () => {
    await walletController.deleteWallet(wallet);
    if (allWallets.length === 1) {
      await walletController.logOut();
      walletController.onboardHelper.reset();
      linkTo('/unAuthRoot');
    } else {
      navigationUtil.popToTop(navigation);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <RemoveWallet
        wallet={wallet}
        handleCancel={handleCancel}
        handleRemoveWallet={handleRemoveWallet}
      />
    </Container>
  );
};

export default RemoveWalletContainer;
