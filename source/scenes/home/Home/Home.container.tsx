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
import { getAccountController } from 'utils/controllersUtils';

///////////////////////////
// Scene
///////////////////////////

import Home from './Home';

///////////////////////////
// Type
///////////////////////////

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import { AssetType } from 'state/vault/types';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import IProvidersState from 'state/providers/types';

interface IHome {
  navigation: any;
  route: any;
}

///////////////////////////
// Container
///////////////////////////

const HomeContainer: FC<IHome> = ({ navigation, route }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const accountController = getAccountController();
  const [balanceObject] = useTotalBalance();

  const { activeWallet, wallets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const { supportedAssets }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const linkTo = useLinkTo();
  const isDagOnlyWallet =
    activeWallet?.assets?.length === 1 &&
    activeWallet?.assets[0]?.type === AssetType.Constellation;
  const ledgerWallets = !!wallets?.ledger ? wallets.ledger : [];
  const bitfiWallets = !!wallets?.bitfi ? wallets.bitfi : [];
  const hardwareWallets = [...ledgerWallets, ...bitfiWallets];
  const multiChainWallets = wallets.local.filter(
    (w) => w.type === KeyringWalletType.MultiChainWallet
  );
  const privateKeyWallets = wallets.local.filter(
    (w) => w.type === KeyringWalletType.SingleAccountWallet
  );

  useEffect(() => {
    const getAssets = async () => {
      await accountController.assetsController.fetchSupportedAssets();
    };
    if (!supportedAssets.data) {
      getAssets();
    }
  }, []);

  const onBuyPressed = () => {
    linkTo('/buyList');
  };

  const onSwapPressed = () => {
    linkTo('/swapTokens');
  };

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
        hardwareWallets={hardwareWallets}
      />
    </Container>
  );
};

export default HomeContainer;
