///////////////////////////
// Imports
///////////////////////////

import React, { FC, useLayoutEffect, useEffect } from 'react';
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
import { AssetType } from 'state/vault/types';

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

  const [balanceObject, balance] = useTotalBalance();

  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const linkTo = useLinkTo();
  const accountController = getAccountController();
  const isDagOnlyWallet = (activeWallet.assets.length === 1 && activeWallet.assets[0].type === AssetType.Constellation);

  useEffect(() => {
    const getAssets = async () => {
      await accountController.assetsController.fetchSupportedAssets();
      await accountController.assetsController.fetchERC20Assets();
    }
    if (!supportedAssets.data) {
      getAssets();
    }
  }, []);

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route }),
      title: activeWallet ? activeWallet.label : "",
    });
  }, [activeWallet]);

  const onBuyPressed = () => {
    linkTo('/buyList');
  };

   const onSwapPressed = () => {
    linkTo('/swapTokens');
   }

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
        onSwapPressed={onSwapPressed}
        isDagOnlyWallet={isDagOnlyWallet}
      />
    </Container>
  );

}

export default HomeContainer;
