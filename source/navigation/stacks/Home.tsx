import React from 'react';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Screens
///////////////////////////
// Home
import Start from 'scenes/home/Start';
import Home from 'scenes/home/Home';
import Asset from 'scenes/home/Asset';
import Send from 'scenes/home/SendAsset/Send';
import Confirm from 'scenes/home/SendAsset/Confirm';
import AssetList from 'scenes/home/Asset/AssetList';
import AddCustomAsset from 'scenes/home/Asset/AddCustomAsset';
import BuyList from 'scenes/home/BuyList';
import BuyAsset from 'scenes/home/BuyAsset';
import SingleSelect from 'scenes/home/SingleSelect';

// Settings
import Import from 'scenes/common/Import';
import Main from 'scenes/settings/Main';
import About from 'scenes/settings/About';
import Networks from 'scenes/settings/Networks';
// import AddNetwork from 'scenes/settings/AddNetwork';
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
// Swap
import SwapTokens from 'scenes/swap/SwapTokens';
import TransferInfo from 'scenes/swap/TransferInfo';
import ConfirmDetails from 'scenes/swap/ConfirmDetails';
import Confirmation from 'scenes/swap/Confirmation';
import SwapHistory from 'scenes/swap/SwapHistory';
import TokenList from 'scenes/swap/TokenList';
import TransactionDetails from 'scenes/swap/TransactionDetails';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import defaultHeader from 'navigation/headers/default';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';


///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();
const SCREEN_DEFAULT_TITLE_STRINGS = {
  wallet: 'Wallet',
  import: 'Import',
  addAsset: 'Manage Tokens',
  addCustomAsset: 'Add Custom Token',
  asset: 'Asset',
  confirm: 'Confirm',
  send: 'Send',
  buyList: 'Buy',
  gasSettings: 'Gas Settings',
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
  manageWallet: 'Manage Wallet',
  removeWallet: 'Delete Wallet',
  privateKey: 'Private Key',
  importWallet: 'Import Wallet',
  importAccount: 'Import Account',
  importPhrase: 'Import Phrase',
  connectedSites: 'Connected Sites',
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
  const initialRoute = isUnlocked ? screens.authorized.home : screens.authorized.start;

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
      initialRouteName={initialRoute}
    >
      {!isUnlocked && (
        <Stack.Screen options={{ headerShown: false }} name={screens.authorized.start} component={Start} />
      )}
      {isUnlocked && (
        <>
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.wallet }} name={screens.authorized.home} component={Home} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.asset }} name={screens.authorized.asset} component={Asset} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirm }} name={screens.authorized.sendConfirm} component={Confirm} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.send }} name={screens.authorized.send} component={Send} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addAsset }} name={screens.authorized.addAsset} component={AssetList} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addCustomAsset }} name={screens.authorized.addCustomAsset} component={AddCustomAsset} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.buyList }} name={screens.authorized.buyList} component={BuyList} />
          <Stack.Screen name={screens.authorized.buyAsset} component={BuyAsset} />
          <Stack.Screen name={screens.authorized.singleSelect} component={SingleSelect} />

          {/* Settings Screens */}
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings }} name={screens.settings.main} component={Main} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.about }} name={screens.settings.about} component={About} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.networks }} name={screens.settings.networks} component={Networks} />
          {/* TODO-349: Add Custom Networks in the future. */}
          {/* <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addNetork }} name={screens.settings.addNetwork} component={AddNetwork} /> */}
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.contacts }} name={screens.settings.contacts} component={Contacts} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.contactInfo }} name={screens.settings.contactInfo} component={ContactInfo} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.modifyContact }} name={screens.settings.modifyContact} component={ModifyContact} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.wallets }} name={screens.settings.wallets} component={Wallets} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addWallet }} name={screens.settings.addWallet} component={AddWallet} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.createWallet }} name={screens.settings.createWallet} component={CreateWallet} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.walletPhrase }} name={screens.settings.walletPhrase} component={walletPhrase} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.manageWallet }} name={screens.settings.manageWallet} component={ManageWallet} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.removeWallet }} name={screens.settings.removeWallet} component={RemoveWallet} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.privateKey }} name={screens.settings.privateKey} component={PrivateKey} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importWallet }} name={screens.settings.importWallet} component={ImportWallet} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importAccount }} name={screens.settings.importAccount} component={ImportAccount} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.importPhrase }} name={screens.settings.importPhrase} component={ImportPhrase} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.connectedSites }} name={screens.settings.connectedSites} component={ConnectedSites} />
          
          {/* Swap Stack */}
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.swapTokens }} name={screens.swap.swapTokens}  component={SwapTokens} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.transferInfo, gestureEnabled: false }} name={screens.swap.transferInfo}  component={TransferInfo} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirmDetails }} name={screens.swap.confirmDetails}  component={ConfirmDetails} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirmation, headerLeft: null, gestureEnabled: false}} name={screens.swap.confirmation}  component={Confirmation} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.swapHistory }} name={screens.swap.swapHistory}  component={SwapHistory} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.tokenList }} name={screens.swap.tokenList}  component={TokenList} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.transactionDetails }} name={screens.swap.transactionDetails}  component={TransactionDetails} />
        </>
      )}
      <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.import }} name={screens.common.import} component={Import} />
    </Stack.Navigator>
  );
};

export default Auth;
