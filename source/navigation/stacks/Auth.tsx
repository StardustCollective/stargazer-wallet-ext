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

const Auth = () => {

  const controller = useController();
  const isUnlocked = controller.wallet.isUnlocked();
  const redirectRoute = controller.appRoute();
  const lockedRoute =  screens.authorized.start;

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
      {!isUnlocked && <Stack.Screen options={{headerShown: false}} name={screens.authorized.start} component={Start} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.home} component={Home} />}
      {isUnlocked && <Stack.Screen name={screens.common.import} component={Import} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.addAsset} component={AddAsset} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.asset} component={Asset} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.sendConfirm} component={SendConfirm} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.send} component={Send} />}
      {isUnlocked && <Stack.Screen name={screens.authorized.gasSettings} component={GasSettings} />}
    </Stack.Navigator>
  );
};

export default Auth;
