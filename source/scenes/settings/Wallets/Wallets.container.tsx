import React, { FC, MouseEvent, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { RootState } from 'state/store';
import IVaultState, { IAccountDerived } from 'state/vault/types';
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

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/settings/wallets/add');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  const privKeyAccounts = wallets.filter((w) => w.type === KeyringWalletType.SingleAccountWallet);

  const handleSwitchWallet = async (walletId: string, walletAccounts: IAccountDerived[]) => {
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
        wallets={wallets}
        activeWallet={activeWallet}
        assets={assets}
        privKeyAccounts={privKeyAccounts}
        handleSwitchWallet={handleSwitchWallet}
        handleManageWallet={handleManageWallet}
      />
    </Container>
  );
};

export default WalletsContainer;
