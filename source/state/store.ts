import { combineReducers, configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import { NODE_ENV } from 'utils/envUtil';

import vault from './vault';
import price from './price';
import contacts from './contacts';
import assets from './assets';
import nfts from './nfts';
import dapp from './dapp';
import process from './process';
import providers from './providers';

import { saveState } from './localStorage';
import rehydrateStore from './rehydrate';

const middleware = [...getDefaultMiddleware({ thunk: false, serializableCheck: false })];

if (NODE_ENV !== 'production') {
  middleware.push(logger);
}

middleware.push(thunk);

const store: Store = configureStore({
  reducer: combineReducers({
    vault,
    price,
    contacts,
    assets,
    nfts,
    dapp,
    process,
    providers,
  }),
  middleware,
  devTools: NODE_ENV !== 'production',
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
