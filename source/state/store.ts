import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { dag4 } from '@stardust-collective/dag4';
import throttle from 'lodash/throttle';
import { isNative, isProd } from 'utils/envUtil';
import MigrationController from 'scripts/Background/controllers/MigrationController';
import { DAG_NETWORK } from 'constants/index';

import vault from './vault';
import price from './price';
import contacts from './contacts';
import assets from './assets';
import nfts from './nfts';
import dapp from './dapp';
import process from './process';
import providers from './providers';
import erc20assets from './erc20assets';
import swap from './swap';

import { saveState } from './localStorage';
import rehydrateStore from './rehydrate';

const middleware: Middleware[] = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
];

if (!isProd) {
  middleware.push(logger);
}

middleware.push(thunk);

const store = configureStore({
  reducer: combineReducers({
    vault,
    price,
    contacts,
    assets,
    nfts,
    dapp,
    process,
    providers,
    erc20assets,
    swap
  }),
  middleware,
  devTools: !isProd,
});

function updateState() {
  const state = store.getState();

  saveState({
    vault: state.vault,
    price: state.price,
    contacts: state.contacts,
    assets: state.assets,
    nfts: state.nfts,
    dapp: state.dapp,
    providers: state.providers,
  });
}

// initialize store from state
if (isNative) {
  MigrationController().then(async () => {
    await rehydrateStore(store);
    store.subscribe(
      throttle(() => {
        // every second we update store state
        updateState();
      }, 1000)
    );

    // DAG Config
    const vault = store.getState().vault;
    const networkId =
      vault &&
      vault.activeNetwork &&
      vault.activeNetwork.Constellation;
    const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main;

    dag4.di.registerStorageClient(localStorage);
    dag4.di.getStateStorageDb().setPrefix('stargazer-');

    dag4.account.connect({
      id: networkInfo.id,
      networkVersion: networkInfo.version,
      ...networkInfo.config,
    }, false);
  });
} else {
  rehydrateStore(store);
  store.subscribe(
    throttle(() => {
      // every second we update store state
      updateState();
    }, 1000)
  );
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
