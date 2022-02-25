import { combineReducers, configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import vault from './vault';
import price from './price';
import contacts from './contacts';
import assets from './assets';
import nfts from './nfts';
import dapp from './dapp';

import { saveState } from './localStorage';
import rehydrateStore from './rehydrate';

const middleware = [...getDefaultMiddleware({ thunk: false, serializableCheck: false })];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
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
});

function updateState() {
  const state = store.getState();

  console.log('state in updateState:', state);
  saveState({
    vault: state.vault,
    price: state.price,
    contacts: state.contacts,
    assets: state.assets,
    nfts: state.nfts,
    dapp: state.dapp,
  });
}

store.subscribe(
  throttle(() => {
    // every second we update store state
    updateState();
  }, 1000)
);

// initialize store from state
rehydrateStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
