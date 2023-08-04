import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import addHeader from 'navigation/headers/add';
import { useLinkTo } from '@react-navigation/native';
import Container, { CONTAINER_COLOR } from 'components/Container';
import Wallets from './Wallets';
import { IWalletsView } from './types';

const WalletsContainer: FC<IWalletsView> = ({ navigation }) => {
  const linkTo = useLinkTo();
  const { wallets, activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const ledgerWallets = !!wallets?.ledger ? wallets.ledger : [];
  const bitfiWallets = !!wallets?.bitfi ? wallets.bitfi : [];
  const hardwareWalletAccounts = [...ledgerWallets, ...bitfiWallets];

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/settings/wallets/add');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  const multiChainAccounts = wallets.local.filter(
    (w) => w.type === KeyringWalletType.MultiChainWallet
  );

  const privKeyAccounts = wallets.local.filter(
    (w) => w.type === KeyringWalletType.SingleAccountWallet
  );

  const handleManageWallet = async (walletId: string) => {
    linkTo(`/settings/wallets/manage?id=${walletId}`);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <Wallets
        multiChainAccounts={multiChainAccounts}
        activeWallet={activeWallet}
        privKeyAccounts={privKeyAccounts}
        hardwareWalletAccounts={hardwareWalletAccounts}
        handleManageWallet={handleManageWallet}
      />
    </Container>
  );
};

export default WalletsContainer;
