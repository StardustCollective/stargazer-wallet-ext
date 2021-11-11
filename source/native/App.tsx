import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';
import Store from 'state/store';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={Store}>
      <NavigationContainer linking={linking}>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
