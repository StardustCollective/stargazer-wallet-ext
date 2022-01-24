import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Store,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import vault  from './vault';
import price from './price';
import contacts from './contacts';
import assets from './assets';
import nfts from './nfts';

import dapp from './dapp';
import { saveState, loadState } from './localStorage';

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const preloadedState = loadState();

//v1.0 wallet state
if (preloadedState && preloadedState.wallet) {
  delete preloadedState.wallet;
}

const store: Store = configureStore({
  reducer: combineReducers({
    vault,
    price,
    contacts,
    assets,
    nfts,
    dapp,
  }),
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

store.subscribe(
  throttle(() => {
    updateState();
  }, 1000)
);

// updateState();

function updateState() {
  const state = store.getState();
  saveState({
    vault: state.vault,
    price: state.price,
    contacts: state.contacts,
    assets: state.assets,
    nfts: state.nfts,
    dapp: state.dapp,
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
