import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NativeBaseProvider} from 'native-base';
import RootStack from 'navigation/stacks/Root';
import linking from 'navigation/linking';
import Store, {persistor} from 'state/store';
import {STORE_PORT, DAG_NETWORK} from 'constants/index';
import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import {dag4} from '@stardust-collective/dag4';

import {KeyringNetwork} from '@stardust-collective/dag4-keyring';

////////////////////
// DAG Config
////////////////////

const vault = Store.getState().vault;
const networkId =
  vault &&
  vault.activeNetwork &&
  vault.activeNetwork[KeyringNetwork.Constellation];
const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main;

dag4.di.getStateStorageDb().setPrefix('stargazer-');
dag4.di.useFetchHttpClient(fetch);
dag4.di.useLocalStorageClient(global.localStorage);
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
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <NavigationContainer linking={linking}>
            <RootStack />
          </NavigationContainer>
          {/* </PersistGate> */}
        </Provider>
      </NativeBaseProvider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
};

export default App;
