import React from 'react';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/home/Start';
import Tabs from '../tabs';
import Import from 'scenes/common/Import';

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
  const isUnlocked = walletController.isUnlocked();
  const initialRoute = isUnlocked ? screens.tabs.root : screens.authorized.start;

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
      initialRouteName={initialRoute}
    >
      {!isUnlocked && (
        <Stack.Screen
          options={{ headerShown: false }}
          name={screens.authorized.start}
          component={Start}
        />
      )}
      {isUnlocked && (
        <Stack.Screen
          options={{ headerShown: false }}
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
