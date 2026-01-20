///////////////////////////
// Modules
///////////////////////////

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native';

import GridIcon from 'assets/images/svg/grid.svg';
import GridFilledIcon from 'assets/images/svg/grid-filled.svg';
import SettingsIcon from 'assets/images/svg/settings.svg';
import SettingsFilledIcon from 'assets/images/svg/settings-filled.svg';
import WalletIcon from 'assets/images/svg/wallet-tab.svg';
import WalletFilledIcon from 'assets/images/svg/wallet-tab-filled.svg';
///////////////////////////
// Constants
///////////////////////////
import { color } from 'assets/styles/tokens';

///////////////////////////
// Components
///////////////////////////
import defaultHeader from 'navigation/headers/default';

import Asset from 'scenes/home/Asset';
import AddCustomAsset from 'scenes/home/Asset/AddCustomAsset';
import AssetList from 'scenes/home/Asset/AssetList';
import BuyAsset from 'scenes/home/BuyAsset';
import BuyList from 'scenes/home/BuyList';
///////////////////////////
// Screens
///////////////////////////
// Home
import Home from 'scenes/home/Home';
import Confirm from 'scenes/home/SendAsset/Confirm';
import Send from 'scenes/home/SendAsset/Send';
import SingleSelect from 'scenes/home/SingleSelect';
// NFTs
import Collections from 'scenes/nfts/Collections';
import NFTDetails from 'scenes/nfts/NFTDetails';
import NFTList from 'scenes/nfts/NFTList';
import NFTSend from 'scenes/nfts/NFTSend';
import NFTSendCompleted from 'scenes/nfts/NFTSendCompleted';
import NFTSendConfirm from 'scenes/nfts/NFTSendConfirm';
import About from 'scenes/settings/About';
import AddWallet from 'scenes/settings/AddWallet';
import CheckPassword from 'scenes/settings/CheckPassword';
import ConnectedSites from 'scenes/settings/ConnectedSites';
import ContactInfo from 'scenes/settings/ContactInfo';
// import AddNetwork from 'scenes/settings/AddNetwork';
import Contacts from 'scenes/settings/Contacts';
import ImportAccount from 'scenes/settings/ImportAccount';
import ImportPhrase from 'scenes/settings/ImportPhrase';
import ImportWallet from 'scenes/settings/ImportWallet';
// Settings
import Main from 'scenes/settings/Main';
import ManageWallet from 'scenes/settings/ManageWallet';
import ModifyContact from 'scenes/settings/ModifyContact';
import Networks from 'scenes/settings/Networks';
import CreateWallet from 'scenes/settings/NewAccount';
import RemoveWallet from 'scenes/settings/RemoveWallet';
import Security from 'scenes/settings/Security';
import Wallets from 'scenes/settings/Wallets';
import Confirmation from 'scenes/swap/Confirmation';
import ConfirmDetails from 'scenes/swap/ConfirmDetails';
import SwapHistory from 'scenes/swap/SwapHistory';
// Swap
import SwapTokens from 'scenes/swap/SwapTokens';
import TokenList from 'scenes/swap/TokenList';
import TransactionDetails from 'scenes/swap/TransactionDetails';
import TransferInfo from 'scenes/swap/TransferInfo';
import ConfirmPhrase from 'scenes/unauth/Phrase/ConfirmPhrase';
import CreatePhrase from 'scenes/unauth/Phrase/CreatePhrase';

import { iosPlatform } from 'utils/platform';

import screens from '../../screens';
import { SCREEN_DEFAULT_TITLE_STRINGS, Stack } from '../home/Home.native';

import styles from './styles';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Stack.Navigator
      screenOptions={navigation => ({
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
          headerLeft: undefined,
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
      screenOptions={navigation => ({
        ...defaultHeader(navigation),
      })}
    >
      {/* NFTs Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.nfts, headerLeft: undefined }}
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
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.blank, headerLeft: undefined }}
        name={screens.nfts.nftsSendCompleted}
        component={NFTSendCompleted}
      />
    </Stack.Navigator>
  );
};

const SettingsTab = () => {
  return (
    <Stack.Navigator
      screenOptions={navigation => ({
        ...defaultHeader(navigation),
      })}
    >
      {/* Settings Stack */}
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings, headerLeft: undefined }}
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
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.bottomTab, !iosPlatform() && styles.bottomTabHeight],
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              {focused && <View style={styles.tabActiveItemLine} />}
              {focused ? (
                <WalletFilledIcon width={32} height={32} color={color.brand_500} />
              ) : (
                <WalletIcon width={32} height={32} color={color.gray_500} />
              )}
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
              {focused ? <GridFilledIcon color={color.brand_500} /> : <GridIcon color={color.gray_500} />}
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
              {focused ? <SettingsFilledIcon color={color.brand_500} /> : <SettingsIcon color={color.gray_500} />}
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
