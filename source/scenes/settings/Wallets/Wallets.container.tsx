import React, { FC, MouseEvent, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { KeyringWalletAccountState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { getWalletController } from 'utils/controllersUtils';

import addHeader from 'navigation/headers/add';
import { useLinkTo } from '@react-navigation/native';

import Container from 'components/Container';

import Wallets from './Wallets';

import { IWalletsView } from './types';

const WalletsContainer: FC<IWalletsView> = ({ navigation }) => {
  const walletController = getWalletController();
  const linkTo = useLinkTo();
  const { wallets, activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
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

  const handleSwitchWallet = async (walletId: string, walletAccounts: KeyringWalletAccountState[]) => {
    await walletController.switchWallet(walletId);
    const accounts = walletAccounts.map((account) => account.address);
    walletController.notifyWalletChange(accounts);
  };

  const handleManageWallet = async (ev: MouseEvent<HTMLButtonElement>, walletId: string) => {
    ev.stopPropagation();
    await walletController.switchWallet(walletId);
    linkTo(`/settings/wallets/manage?id=${walletId}`);
  };

  return (
    <Container safeArea={false}>
      <Wallets
        wallets={multiChainAccounts}
        activeWallet={activeWallet}
        privKeyAccounts={privKeyAccounts}
        hardwareWalletAccounts={hardwareWalletAccounts}
        assets={assets}
        handleSwitchWallet={handleSwitchWallet}
        handleManageWallet={handleManageWallet}
      />
    </Container>
  );
};

export default WalletsContainer;
