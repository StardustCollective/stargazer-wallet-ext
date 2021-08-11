import React from 'react';

///////////////////////////
// Hooks
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/home/Start';
import Home from 'scenes/home/Home';
import Asset from 'scenes/home/Asset';
import Send, { SendConfirm } from 'scenes/home/Send';
import GasSettings from 'scenes/home/Send/GasSettings';
import AddAsset from 'scenes/home/Asset/AddAsset';
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

import { createStackNavigator } from '@react-navigation/stack';
import defaultHeader from 'navigation/headers/default'
///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();
const SCREEN_DEFAULT_TITLE_STRINGS = {
  wallet: 'Wallet',
  import: 'Import',
  addAsset: 'Add Asset',
  asset: 'Asset',
  confirm: 'Confirm',
  send: 'Send',
  gasSettings: 'Gas Settings',
  settings: 'Settings'
}

const Auth = () => {

  const controller = useController();
  const isUnlocked = controller.wallet.isUnlocked();
  const redirectRoute = controller.appRoute();
  const lockedRoute = screens.authorized.start;

  let unlockedRoute = screens.authorized.home;

  // If there is a pending confirmation for a send
  // the user will be returned to the confirm screen
  // if they exit and return to the app.
  if (
    redirectRoute === screens.authorized.sendConfirm &&
    controller.wallet.account.getTempTx()
  ) {
    unlockedRoute = screens.authorized.sendConfirm;
  }

  let initialRoute = isUnlocked ? unlockedRoute : lockedRoute;

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({ 
        ...defaultHeader(navigation),
        animationEnabled: true 
      })}
      initialRouteName={initialRoute}>
      {!isUnlocked && <Stack.Screen options={{ headerShown: false }} name={screens.authorized.start} component={Start} />}
      { isUnlocked && (
        <>
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.wallet }} name={screens.authorized.home} component={Home} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.import }} name={screens.common.import} component={Import} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.addAsset }} name={screens.authorized.addAsset} component={AddAsset} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.asset }} name={screens.authorized.asset} component={Asset} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.confirm }} name={screens.authorized.sendConfirm} component={SendConfirm} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.send }} name={screens.authorized.send} component={Send} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.gasSettings }} name={screens.authorized.gasSettings} component={GasSettings} />
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings, headerShown: false }} name={screens.authorized.settings} component={SettingStack} />
        </>)
      }
    </Stack.Navigator>
  );
};

export default Auth;
