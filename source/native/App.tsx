import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NativeBaseProvider} from 'native-base';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';
import Store from 'state/store';
import {STORE_PORT, DAG_NETWORK} from 'constants/index';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import {dag4} from '@stardust-collective/dag4';
import {KeyringNetwork} from '@stardust-collective/dag4-keyring';
import { COLORS } from 'assets/styles/_variables';

////////////////////
// DAG Config
////////////////////

const vault = Store.getState().vault;
const networkId =
  vault &&
  vault.activeNetwork &&
  vault.activeNetwork[KeyringNetwork.Constellation];
const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main;

dag4.di.registerStorageClient(localStorage);
dag4.di.getStateStorageDb().setPrefix('stargazer-');
dag4.di.useFetchHttpClient(fetch);

dag4.network.config({
  id: networkInfo.id,
  beUrl: networkInfo.beUrl,
  lbUrl: networkInfo.lbUrl,
});

const App = () => {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <Provider store={Store}>
          <NavigationContainer linking={linking}>
            <StatusBar translucent barStyle="light-content" backgroundColor={COLORS.primary} />
            <RootStack />
          </NavigationContainer>
        </Provider>
      </NativeBaseProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
};

export default App;
