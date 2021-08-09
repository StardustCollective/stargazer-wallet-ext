import React from 'react';

///////////////////////////
// Hooks
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Screens
///////////////////////////

import Main from 'scenes/settings/Main';

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
  settings: 'Settings',
}

const Settings = () => {

  const controller = useController();
  const isUnlocked = controller.wallet.isUnlocked();

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({ 
        ...defaultHeader(navigation),
        animationEnabled: true,
      })}
      initialRouteName={screens.settings.main}>
      { isUnlocked && (
        <>
          <Stack.Screen options={{ title: SCREEN_DEFAULT_TITLE_STRINGS.settings }} name={screens.settings.main} component={Main} />
        </>)
      }
    </Stack.Navigator>
  );
};

export default Settings;
