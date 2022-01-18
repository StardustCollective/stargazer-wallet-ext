/// ////////////////////////
// Modules
/// ////////////////////////

import React from 'react';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';

/// ////////////////////////
// Hooks
/// ////////////////////////

import { useSelector } from 'react-redux';

/// ////////////////////////
// Stacks
/// ////////////////////////

// import HomeStack from './Home';
// import UnAuthStack from './UnAuth';

import Sandbox from 'scenes/sandbox';
/// ////////////////////////
// Screens Names
/// ////////////////////////

/// ////////////////////////
// Navigation
/// ////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import defaultHeader from 'navigation/headers/default';

import screens from '../screens';

/// ////////////////////////
// Constants
/// ////////////////////////

const Stack = createStackNavigator();

const Root = () => {
  let initialRoute = screens.unAuthorized.root;

  const { wallets, hasEncryptedVault, migrateWallet }: IVaultState =
    useSelector((state: RootState) => state.vault);

  if (
    migrateWallet ||
    (wallets && Object.values(wallets).length > 0) ||
    hasEncryptedVault
  ) {
    initialRoute = screens.authorized.root;
  }

  return (
    <Stack.Navigator
      screenOptions={(navigation) => ({
        ...defaultHeader(navigation),
      })}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name={screens.unAuthorized.root}
        component={Sandbox}
      />
    </Stack.Navigator>
  );
};

export default Root;
