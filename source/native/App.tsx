import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NativeBaseProvider} from 'native-base';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';
import Store from 'state/store';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <Provider store={Store}>
          <NavigationContainer linking={linking}>
            <RootStack />
          </NavigationContainer>
        </Provider>
      </NativeBaseProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
};

export default App;
