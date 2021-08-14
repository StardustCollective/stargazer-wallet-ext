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
import defaultHeader from 'navigation/headers/default'

///////////////////////////
// Constants
///////////////////////////

const Stack = createStackNavigator();
const DEFAULT_TITLE = 'Stargazer';

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
    screenOptions={(navigation) => ({ 
      ...defaultHeader(navigation),
      animationEnabled: true 
    })}
      initialRouteName={initialRoute}
    >
      <Stack.Screen options={{ headerShown: false, title: DEFAULT_TITLE }} name={screens.unAuthorized.home} component={Start} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.common.import} component={Import} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.remind} component={Remind} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPass} component={CreatePass} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseGenerated} component={CreatePhrase} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseRemind} component={RemindPhrase} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseCheck} component={ConfirmPhrase} />
    </Stack.Navigator>
  );
};

export default UnAuth;
