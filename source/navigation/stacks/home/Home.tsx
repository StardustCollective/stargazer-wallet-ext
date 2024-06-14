import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';
import { clearSession, getSgw, sessionExpired } from 'utils/keyring';
import store, { RootState } from 'state/store';
import { setLoading } from 'state/auth';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/home/Start';
import Tabs from '../tabs';
import Import from 'scenes/common/Import';
import Loading from 'scenes/unauth/Loading';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import defaultHeader from 'navigation/headers/default';

///////////////////////////
// Constants
///////////////////////////

import screens from '../../screens';
export const Stack = createStackNavigator();
export const SCREEN_DEFAULT_TITLE_STRINGS = {
  blank: '',
  wallet: 'Wallet',
  import: 'Import',
  addAsset: 'Manage Tokens',
  addCustomAsset: 'Add Custom Token',
  asset: 'Asset',
  confirm: 'Confirm',
  send: 'Send',
  buyList: 'Buy',
  gasSettings: 'Gas Settings',
  // NFTs
  nfts: 'My NFTs',
  nftsSend: 'Transfer details',
  // Settings
  settings: 'Settings',
  about: 'About',
  networks: 'Networks',
  addNetork: 'Add Network',
  contacts: 'Contacts',
  modifyContact: 'Add Contact',
  wallets: 'Wallets',
  contactInfo: 'Contact Info',
  addWallet: 'Add Wallet',
  createWallet: 'Create Wallet',
  walletPhrase: 'Wallet Phrase',
  checkPassword: 'Wallet Phrase',
  manageWallet: 'Manage Wallet',
  removeWallet: 'Remove Wallet',
  privateKey: 'Private Key',
  importWallet: 'Import Wallet',
  importAccount: 'Import Account',
  importPhrase: 'Import Phrase',
  connectedSites: 'Connected Sites',
  security: 'Security',
  // Swap
  swapTokens: 'Swap Tokens',
  transferInfo: 'Transfer Info',
  confirmDetails: 'Confirm Details',
  confirmation: '',
  swapHistory: 'Swap History',
  tokenList: '',
  transactionDetails: 'Transaction Details',
};

const Auth = () => {
  const walletController = getWalletController();

  const { unlocked, loading } = useSelector((state: RootState) => state.auth);

  const hideLoadingScreen = () => {
    setTimeout(() => {
      store.dispatch(setLoading(false));
    }, 500);
  };

  useEffect(() => {
    if (loading && unlocked) {
      hideLoadingScreen();
    }
  }, [unlocked, loading]);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (unlocked) return;

      store.dispatch(setLoading(true));

      const expired = await sessionExpired();

      if (expired) {
        // Session expired. User needs to login again
        await walletController.logOut();
        await clearSession();
        hideLoadingScreen();
        return;
      }

      const sgw = await getSgw();

      if (!sgw) {
        hideLoadingScreen();
        return;
      }

      const success = await walletController.unLock(sgw);

      if (!success) {
        hideLoadingScreen();
        return;
      }
    };

    checkWalletStatus();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    >
      {loading && (
        <Stack.Screen
          options={{ headerShown: false, animationEnabled: false }}
          name={screens.authorized.homeLoading}
          component={Loading}
        />
      )}
      {!unlocked && !loading && (
        <Stack.Screen
          options={{ headerShown: false, animationEnabled: false }}
          name={screens.authorized.start}
          component={Start}
        />
      )}
      {unlocked && !loading && (
        <Stack.Screen
          options={{ headerShown: false, animationEnabled: false }}
          name={screens.tabs.root}
          component={Tabs}
        />
      )}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.import }}
        name={screens.common.import}
        component={Import}
      />
    </Stack.Navigator>
  );
};

export default Auth;
