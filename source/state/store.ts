import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit';
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
import providers from './providers';
import erc20assets from './erc20assets';
import swap from './swap';
import biometrics from './biometrics';
import auth from './auth';

import { loadState, saveState } from './localStorage';
import rehydrateStore from './rehydrate';
import { compareObjects } from 'utils/objects';

const middleware: Middleware[] = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
];

middleware.push(thunk);

const store = configureStore({
  reducer: combineReducers({
    vault,
    price,
    contacts,
    assets,
    nfts,
    dapp,
    providers,
    erc20assets,
    swap,
    biometrics,
    auth,
  }),
  middleware,
  devTools: !isProd,
});

export async function updateState() {
  const state = store.getState();

  const updatedState = {
    vault: state.vault,
    price: state.price,
    contacts: state.contacts,
    assets: state.assets,
    dapp: state.dapp,
    swap: {
      txIds: state.swap.txIds,
    },
    biometrics: state.biometrics,
  };

  const currentState = await loadState();

  if (currentState) {
    const updatedNoPrice = { ...updatedState };
    const currentNoPrice = { ...currentState };
    delete updatedNoPrice.price;
    delete currentNoPrice.price;
    const equalStates = compareObjects(updatedNoPrice, currentNoPrice);
    if (equalStates) return false;
  }

  await saveState(updatedState);
  return true;
}

// initialize store from state
if (isNative) {
  MigrationController().then(async () => {
    await rehydrateStore(store);
    store.subscribe(
      throttle(async () => {
        // every second we update store state
        await updateState();
      }, 1000)
    );

    // DAG Config
    const vault = store.getState().vault;
    const networkId = vault && vault.activeNetwork && vault.activeNetwork.Constellation;
    const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main2;

    dag4.di.useLocalStorageClient(localStorage);
    dag4.di.getStateStorageDb().setPrefix('stargazer-');

    dag4.account.connect(
      {
        id: networkInfo.id,
        networkVersion: networkInfo.version,
        ...networkInfo.config,
      },
      false
    );
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
