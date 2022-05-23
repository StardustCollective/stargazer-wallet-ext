///////////////////////////
// Imports
///////////////////////////

import React, { FC, useLayoutEffect, useEffect } from 'react';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';
import homeHeader from 'navigation/headers/home';

///////////////////////////
// Hooks
///////////////////////////

import { useTotalBalance } from 'hooks/usePrice';

///////////////////////////
// Scene
///////////////////////////

import Home from './Home';

///////////////////////////
// Type
///////////////////////////

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import IProvidersState from 'state/providers/types';
import { getAccountController } from 'utils/controllersUtils';

interface IHome {
  navigation: any,
  route: any,
}

///////////////////////////
// Container
///////////////////////////

const HomeContainer: FC<IHome> = ({ navigation, route }) => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const { wallets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const hasMainAccount = wallets.local.length && wallets.local.some((w) => w.type === KeyringWalletType.MultiChainWallet);
  const [balanceObject, balance] = useTotalBalance();

  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const linkTo = useLinkTo();
  const accountController = getAccountController();

  useEffect(() => {
    const getAssets = async () => {
      await accountController.assetsController.fetchSupportedAssets();
    }
    if (!supportedAssets.data) {
      getAssets();
    }
  }, []);

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route, hasMainAccount }),
      title: activeWallet ? activeWallet.label : "",
    });
  }, [activeWallet]);

  const onBuyPressed = () => {
    linkTo('/buyList');
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false}>
      <Home
        activeWallet={activeWallet}
        balanceObject={balanceObject}
        balance={balance}
        onBuyPressed={onBuyPressed}
      />
    </Container>
  );

}

export default HomeContainer;
