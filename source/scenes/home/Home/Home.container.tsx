///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

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
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

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

  const [balanceObject] = useTotalBalance();

  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);
  const { activeWallet, wallets, currentNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const linkTo = useLinkTo();
  const accountController = getAccountController();
  const isDagOnlyWallet = (activeWallet?.assets?.length === 1 && activeWallet?.assets[0]?.type === AssetType.Constellation);
  const multiChainWallets = wallets.local.filter(
    (w) => w.type === KeyringWalletType.MultiChainWallet
  );
  const privateKeyWallets = wallets.local.filter(
    (w) => w.type === KeyringWalletType.SingleAccountWallet
  );

  useEffect(() => {
    const getAssets = async () => {
      await accountController.assetsController.fetchSupportedAssets();
      await accountController.assetsController.fetchERC20Assets();
    }
    if (!supportedAssets.data) {
      getAssets();
    }
  }, []);

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
        navigation={navigation}
        route={route}
        activeWallet={activeWallet}
        balanceObject={balanceObject}
        onBuyPressed={onBuyPressed}
        onSwapPressed={onSwapPressed}
        isDagOnlyWallet={isDagOnlyWallet}
        multiChainWallets={multiChainWallets}
        privateKeyWallets={privateKeyWallets}
        currentNetwork={currentNetwork}
      />
    </Container>
  );

}

export default HomeContainer;
