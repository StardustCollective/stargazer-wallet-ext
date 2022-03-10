import React from 'react';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/home/Start';
import Home from 'scenes/home/Home';
import Asset from 'scenes/home/Asset';
import Send from 'scenes/home/SendAsset/Send';
import Confirm from 'scenes/home/SendAsset/Confirm';
import Import from 'scenes/common/Import';

///////////////////////////
// Stacks
///////////////////////////

import SettingStack from './Settings';

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
  wallet: 'Wallet',
  import: 'Import',
  addAsset: 'Add Asset',
  asset: 'Asset',
  confirm: 'Confirm',
  send: 'Send',
  gasSettings: 'Gas Settings',
  settings: 'Settings',
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
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings, headerShown: false }} name={screens.authorized.settings} component={SettingStack} />
        </>)
      }
      <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.import }} name={screens.common.import} component={Import} />
    </Stack.Navigator>
  );
};

export default Auth;
