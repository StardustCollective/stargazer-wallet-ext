import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from 'navigation/stacks/Root';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import linking from 'navigation/linking';
import { useController } from 'hooks/index';

import 'assets/styles/global.scss';

const App: FC = () => {

  const controller = useController();

  const onNavigationStateChange = (state: any) => {
    const routes = state.routes;
    const currentRoute = routes[routes.length - 1];
    const currentRouteName = currentRoute.name;
    // Store the route name, it will be used at start up to
    // preserve the screen state.
    controller.appRoute(currentRouteName);
  }

  return (
    <NavigationContainer linking={linking} onStateChange={onNavigationStateChange}>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
