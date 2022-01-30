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
import RemindPhrase from 'scenes/unauth/Phrase/RemindPhrase';
import CreatePhrase from 'scenes/unauth/Phrase/CreatePhrase';
import ConfirmPhrase from 'scenes/unauth/Phrase/ConfirmPhrase';
import Import from 'scenes/common/Import/ImportPhrase';

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
const DEFAULT_TITLE = 'Stargazer';

///////////////////////////
// Stack Component
///////////////////////////

const UnAuth = () => {

  /**
   * --- Create Account Flow ---
   * Start => Remind => CreatePass => RemindPhrase => CreatePhrase => ConfirmPhrase
   */

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    initialRouteName={screens.unAuthorized.home}
    >
      <Stack.Screen options={{ headerShown: false, title: DEFAULT_TITLE }} name={screens.unAuthorized.home} component={Start} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPass} component={CreatePass} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseGenerated} component={CreatePhrase} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseRemind} component={RemindPhrase} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.createPhraseCheck} component={ConfirmPhrase} />
      <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.common.import} component={Import} />
      {/* <Stack.Screen options={{ title: DEFAULT_TITLE }} name={screens.unAuthorized.remind} component={Remind} /> */}


    </Stack.Navigator>
  );
};

export default UnAuth;
