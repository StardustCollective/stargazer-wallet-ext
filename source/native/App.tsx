import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
