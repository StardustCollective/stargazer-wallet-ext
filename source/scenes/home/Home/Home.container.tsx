///////////////////////////
// Imports
///////////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

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
import { AssetType } from 'state/vault/types';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import FlagsSelectors from 'selectors/flagsSelectors';
import walletsSelectors from 'selectors/walletsSelectors';

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

  const [balanceObject] = useTotalBalance();

  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const loadingBalances = useSelector(FlagsSelectors.getLoadingBalances);
  const loadingDAGBalances = useSelector(FlagsSelectors.getLoadingDAGBalances);
  const loadingETHBalances = useSelector(FlagsSelectors.getLoadingETHBalances);
  const hardwareWallets = useSelector(walletsSelectors.selectAllHardwareWallets);
  const multiChainWallets = useSelector(walletsSelectors.selectMultiChainWallets);
  const privateKeyWallets = useSelector(walletsSelectors.selectSingleAccountWallets);

  const linkTo = useLinkTo();
  const isDagOnlyWallet =
    activeWallet?.assets?.length === 1 &&
    activeWallet?.assets[0]?.type === AssetType.Constellation;

  const onBuyPressed = () => {
    linkTo('/buyList');
  };

  const onSwapPressed = () => {
    linkTo('/swapTokens');
  };
  const loading =
    activeWallet?.type === KeyringWalletType.MultiChainWallet
      ? loadingBalances
      : activeWallet?.supportedAssets?.includes(KeyringAssetType.ETH)
      ? loadingETHBalances
      : loadingDAGBalances;

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.DARK} safeArea={false}>
      <Home
        navigation={navigation}
        route={route}
        activeWallet={activeWallet}
        balanceObject={balanceObject}
        loadingBalances={loading}
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
