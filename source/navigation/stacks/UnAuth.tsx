///////////////////////////
// Modules
///////////////////////////

import React from 'react';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/unauth/Start';
import Remind from 'scenes/unauth/Remind';
import CreatePass from 'scenes/unauth/CreatePass';
import {
  CreatePhrase,
  ConfirmPhrase,
  RemindPhrase,
} from 'scenes/unauth/Phrase';
import Import from 'scenes/common/Import';

///////////////////////////
// Screens Names
///////////////////////////

import screens from '../screens';

///////////////////////////
// Navigation
///////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import { useController } from 'hooks/index';

///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();

///////////////////////////
// Stack Component
///////////////////////////

const UnAuth = () => {

  const controller = useController();
  let initialRoute = controller.appRoute() || screens.unAuthorized.home;

  /**
   * --- Create Account Flow ---
   * Start => Remind => CreatePass => RemindPhrase => CreatePhrase => ConfirmPhrase
   */

  return (
    <Stack.Navigator
      screenOptions={{ animationEnabled: true, headerShown: false }} 
      initialRouteName={initialRoute}
    >
      <Stack.Screen name={screens.unAuthorized.home} component={Start} />
      <Stack.Screen name={screens.common.import} component={Import} />
      <Stack.Screen name={screens.unAuthorized.remind} component={Remind} />
      <Stack.Screen name={screens.unAuthorized.createPass} component={CreatePass} />
      <Stack.Screen name={screens.unAuthorized.createPhraseGenerated} component={CreatePhrase} />
      <Stack.Screen name={screens.unAuthorized.createPhraseRemind} component={RemindPhrase} />
      <Stack.Screen name={screens.unAuthorized.createPhraseCheck} component={ConfirmPhrase} />
    </Stack.Navigator>
  );
};

export default UnAuth;
