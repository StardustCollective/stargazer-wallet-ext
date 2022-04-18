///////////////////////////
// Imports
///////////////////////////

import React, { FC, useLayoutEffect } from 'react';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { useSelector } from 'react-redux';

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
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route, hasMainAccount }),
      title: activeWallet ? activeWallet.label : "",
    });
  }, [activeWallet]);

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false}>
      <Home
        activeWallet={activeWallet}
        balanceObject={balanceObject}
        balance={balance}
      />
    </Container>
  );

}

export default HomeContainer;
