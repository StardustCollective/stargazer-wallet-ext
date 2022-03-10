///////////////////////////
// Modules
///////////////////////////

import React from 'react';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Screens
///////////////////////////

import Main from 'scenes/settings/Main';
import About from 'scenes/settings/About';
import Networks from 'scenes/settings/Networks';
import Contacts from 'scenes/settings/Contacts';
import ContactInfo from 'scenes/settings/ContactInfo';
import ModifyContact from 'scenes/settings/ModifyContact';
import Wallets from 'scenes/settings/Wallets';
import AddWallet from 'scenes/settings/AddWallet';
import CreateWallet from 'scenes/settings/NewAccount';
import walletPhrase from 'scenes/settings/Phrase';
import ManageWallet from 'scenes/settings/ManageWallet';
import RemoveWallet from 'scenes/settings/RemoveWallet';
import PrivateKey from 'scenes/settings/PrivateKey';
import ImportWallet from 'scenes/settings/ImportWallet';
import ImportAccount from 'scenes/settings/ImportAccount';
import ImportPhrase from 'scenes/settings/ImportPhrase';
import ConnectedSites from 'scenes/settings/ConnectedSites';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';

///////////////////////////
// Navigation
///////////////////////////

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import defaultHeader from 'navigation/headers/default';

///////////////////////////
// Constants
///////////////////////////

const Stack = createNativeStackNavigator();
const SCREEN_DEFAULT_TITLE_STRINGS = {
  settings: 'Settings',
  about: 'About',
  networks: 'Networks',
  contacts: 'Contacts',
  modifyContact: 'Add Contact',
  wallets: 'Wallets',
  contactInfo: 'Contact Info',
  addWallet: 'Add Wallet',
  createWallet: 'Create Wallet',
  walletPhrase: 'Wallet Phrase',
  manageWallet: 'Manage Wallet',
  removeWallet: 'Delete Wallet',
  privateKey: 'Private Key',
  importWallet: 'Import Wallet',
  importAccount: 'Import Account',
  importPhrase: 'Import Phrase',
  connectedSites: 'Connected Sites',
};

const Settings = () => {
  const walletController = getWalletController();
  const isUnlocked = walletController.isUnlocked();

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
      initialRouteName={screens.settings.main}
    >
      {isUnlocked && (
        <>
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings }}
            name={screens.settings.main}
            component={Main}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.about }}
            name={screens.settings.about}
            component={About}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.networks }}
            name={screens.settings.networks}
            component={Networks}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.contacts }}
            name={screens.settings.contacts}
            component={Contacts}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.contactInfo }}
            name={screens.settings.contactInfo}
            component={ContactInfo}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.modifyContact }}
            name={screens.settings.modifyContact}
            component={ModifyContact}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.wallets }}
            name={screens.settings.wallets}
            component={Wallets}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addWallet }}
            name={screens.settings.addWallet}
            component={AddWallet}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.createWallet }}
            name={screens.settings.createWallet}
            component={CreateWallet}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.walletPhrase }}
            name={screens.settings.walletPhrase}
            component={walletPhrase}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.manageWallet }}
            name={screens.settings.manageWallet}
            component={ManageWallet}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.removeWallet }}
            name={screens.settings.removeWallet}
            component={RemoveWallet}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.privateKey }}
            name={screens.settings.privateKey}
            component={PrivateKey}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importWallet }}
            name={screens.settings.importWallet}
            component={ImportWallet}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importAccount }}
            name={screens.settings.importAccount}
            component={ImportAccount}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importPhrase }}
            name={screens.settings.importPhrase}
            component={ImportPhrase}
          />
          <Stack.Screen
            options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.connectedSites }}
            name={screens.settings.connectedSites}
            component={ConnectedSites}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Settings;
