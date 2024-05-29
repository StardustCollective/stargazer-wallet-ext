///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

///////////////////////////
// Components
///////////////////////////

import defaultHeader from 'navigation/headers/default';
import WalletIcon from 'assets/images/svg/wallet-tab.svg';
import GridIcon from 'assets/images/svg/grid.svg';
import SettingsIcon from 'assets/images/svg/settings.svg';

///////////////////////////
// Screens
///////////////////////////

// Home
import Home from 'scenes/home/Home';
import Asset from 'scenes/home/Asset';
import Send from 'scenes/home/SendAsset/Send';
import Confirm from 'scenes/home/SendAsset/Confirm';
import AssetList from 'scenes/home/Asset/AssetList';
import AddCustomAsset from 'scenes/home/Asset/AddCustomAsset';
import BuyList from 'scenes/home/BuyList';
import BuyAsset from 'scenes/home/BuyAsset';
import SingleSelect from 'scenes/home/SingleSelect';

// NFTs
import Collections from 'scenes/nfts/Collections';
import NFTList from 'scenes/nfts/NFTList';
import NFTDetails from 'scenes/nfts/NFTDetails';
import NFTSend from 'scenes/nfts/NFTSend';
import NFTSendConfirm from 'scenes/nfts/NFTSendConfirm';
import NFTSendCompleted from 'scenes/nfts/NFTSendCompleted';

// Settings
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
import CreatePhrase from 'scenes/unauth/Phrase/CreatePhrase';
import ConfirmPhrase from 'scenes/unauth/Phrase/ConfirmPhrase';
import walletPhrase from 'scenes/settings/Phrase';
import CheckPassword from 'scenes/settings/CheckPassword';
import ManageWallet from 'scenes/settings/ManageWallet';
import RemoveWallet from 'scenes/settings/RemoveWallet';
import PrivateKey from 'scenes/settings/PrivateKey';
import ImportWallet from 'scenes/settings/ImportWallet';
import ImportAccount from 'scenes/settings/ImportAccount';
import ImportPhrase from 'scenes/settings/ImportPhrase';
import ConnectedSites from 'scenes/settings/ConnectedSites';
import Security from 'scenes/settings/Security';

// Swap
import SwapTokens from 'scenes/swap/SwapTokens';
import TransferInfo from 'scenes/swap/TransferInfo';
import ConfirmDetails from 'scenes/swap/ConfirmDetails';
import Confirmation from 'scenes/swap/Confirmation';
import SwapHistory from 'scenes/swap/SwapHistory';
import TokenList from 'scenes/swap/TokenList';
import TransactionDetails from 'scenes/swap/TransactionDetails';

///////////////////////////
// Constants
///////////////////////////

import { NEW_COLORS } from 'assets/styles/_variables';
import { SCREEN_DEFAULT_TITLE_STRINGS, Stack } from '../home/Home.native';
import { iosPlatform } from 'utils/platform';
import screens from '../../screens';
import styles from './styles';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    >
      {/* Home Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.wallet }}
        name={screens.authorized.home}
        component={Home}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.asset }}
        name={screens.authorized.asset}
        component={Asset}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirm }}
        name={screens.authorized.sendConfirm}
        component={Confirm}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.send }}
        name={screens.authorized.send}
        component={Send}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addAsset }}
        name={screens.authorized.addAsset}
        component={AssetList}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addCustomAsset }}
        name={screens.authorized.addCustomAsset}
        component={AddCustomAsset}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.buyList }}
        name={screens.authorized.buyList}
        component={BuyList}
      />
      <Stack.Screen name={screens.authorized.buyAsset} component={BuyAsset} />
      <Stack.Screen name={screens.authorized.singleSelect} component={SingleSelect} />

      {/* Swap Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.swapTokens }}
        name={screens.swap.swapTokens}
        component={SwapTokens}
      />
      <Stack.Screen
        options={{
          title: SCREEN_DEFAULT_TITLE_STRINGS.transferInfo,
          gestureEnabled: false,
        }}
        name={screens.swap.transferInfo}
        component={TransferInfo}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirmDetails }}
        name={screens.swap.confirmDetails}
        component={ConfirmDetails}
      />
      <Stack.Screen
        options={{
          title: SCREEN_DEFAULT_TITLE_STRINGS.confirmation,
          headerLeft: null,
          gestureEnabled: false,
        }}
        name={screens.swap.confirmation}
        component={Confirmation}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.swapHistory }}
        name={screens.swap.swapHistory}
        component={SwapHistory}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.tokenList }}
        name={screens.swap.tokenList}
        component={TokenList}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.transactionDetails }}
        name={screens.swap.transactionDetails}
        component={TransactionDetails}
      />
    </Stack.Navigator>
  );
};

const NftsTab = () => {
  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    >
      {/* NFTs Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.nfts, headerLeft: null }}
        name={screens.nfts.collections}
        component={Collections}
      />
      <Stack.Screen name={screens.nfts.nftsList} component={NFTList} />
      <Stack.Screen name={screens.nfts.nftsDetail} component={NFTDetails} />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.nftsSend }}
        name={screens.nfts.nftsSend}
        component={NFTSend}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.nftsSend }}
        name={screens.nfts.nftsSendConfirm}
        component={NFTSendConfirm}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.blank, headerLeft: null }}
        name={screens.nfts.nftsSendCompleted}
        component={NFTSendCompleted}
      />
    </Stack.Navigator>
  );
};

const SettingsTab = () => {
  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    >
      {/* Settings Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings, headerLeft: null }}
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
      {/* TODO-349: Add Custom Networks in the future. */}
      {/* <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addNetork }} name={screens.settings.addNetwork} component={AddNetwork} /> */}
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
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.createWallet }}
        name={screens.unAuthorized.createPhraseGenerated}
        component={CreatePhrase}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.createWallet }}
        name={screens.unAuthorized.createPhraseCheck}
        component={ConfirmPhrase}
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
      <Stack.Screen name={screens.settings.checkPassword} component={CheckPassword} />
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
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.security }}
        name={screens.settings.security}
        component={Security}
      />
    </Stack.Navigator>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: !iosPlatform() ? styles.bottomTab : {},
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              {focused && <View style={styles.tabActiveItemLine} />}
              <WalletIcon
                height={24}
                width={24}
                color={focused ? NEW_COLORS.primary_lighter_2 : NEW_COLORS.gray_400}
              />
            </View>
          ),
        }}
        name={screens.tabs.home}
        component={HomeTab}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              {focused && <View style={styles.tabActiveItemLine} />}
              <GridIcon
                height={24}
                width={24}
                color={focused ? NEW_COLORS.primary_lighter_2 : NEW_COLORS.gray_400}
              />
            </View>
          ),
        }}
        name={screens.tabs.nfts}
        component={NftsTab}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              {focused && <View style={styles.tabActiveItemLine} />}
              <SettingsIcon
                height={24}
                width={24}
                color={focused ? NEW_COLORS.primary_lighter_2 : NEW_COLORS.gray_400}
              />
            </View>
          ),
        }}
        name={screens.tabs.settings}
        component={SettingsTab}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
