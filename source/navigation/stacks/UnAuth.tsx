///////////////////////////
// Modules
///////////////////////////

import React from 'react';

///////////////////////////
// Screens
///////////////////////////

import Start from 'scenes/unauth/Start';
import CreatePass from 'scenes/unauth/CreatePass';
import RemindPhrase from 'scenes/unauth/Phrase/RemindPhrase';
import CreatePhrase from 'scenes/unauth/Phrase/CreatePhrase';
import ConfirmPhrase from 'scenes/unauth/Phrase/ConfirmPhrase';
import Import from 'scenes/common/Import';

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
const DEFAULT_TITLE = 'Stargazer';
const SCREEN_DEFAULT_TITLE_STRINGS = {
  import: 'Restore Wallet',
};

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
      <Stack.Screen
        options={{ headerShown: false, title: DEFAULT_TITLE }}
        name={screens.unAuthorized.home}
        component={Start}
      />
      <Stack.Screen
        options={{ title: DEFAULT_TITLE }}
        name={screens.unAuthorized.createPass}
        component={CreatePass}
      />
      <Stack.Screen
        options={{ title: DEFAULT_TITLE }}
        name={screens.unAuthorized.createPhraseGenerated}
        component={CreatePhrase}
      />
      <Stack.Screen
        options={{ title: DEFAULT_TITLE }}
        name={screens.unAuthorized.createPhraseRemind}
        component={RemindPhrase}
      />
      <Stack.Screen
        options={{ title: DEFAULT_TITLE }}
        name={screens.unAuthorized.createPhraseCheck}
        component={ConfirmPhrase}
      />
      <Stack.Screen
        options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.import }}
        name={screens.common.import}
        component={Import}
      />
    </Stack.Navigator>
  );
};

export default UnAuth;
