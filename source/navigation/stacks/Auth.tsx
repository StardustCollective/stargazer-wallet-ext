import React from 'react';

///////////////////////////
// Hooks
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Screens
///////////////////////////

import Start from 'containers/auth/Start';
import Home from 'containers/auth/Home';
import Asset from 'containers/auth/Asset';
import Send, { SendConfirm } from 'containers/auth/Send';
import GasSettings from 'containers/auth/Send/GasSettings';
import AddAsset from 'containers/auth/Asset/AddAsset';
import Import from 'containers/common/Import';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';

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
  gasSettings: 'Gas Settings'
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
      screenOptions={{ animationEnabled: true }}
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
        </>)
      }
    </Stack.Navigator>
  );
};

export default Auth;
