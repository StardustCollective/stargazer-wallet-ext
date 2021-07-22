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

import dapp from './dapp';
import { saveState, loadState } from './localStorage';

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const store: Store = configureStore({
  reducer: combineReducers({
    vault,
    price,
    contacts,
    assets,
    dapp,
  }),
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState(),
});

store.subscribe(
  throttle(() => {
    updateState();
  }, 1000)
);

function updateState() {
  const state = store.getState();
  saveState({
    vault: state.vault,
    price: state.price,
    contacts: state.contacts,
    assets: state.assets,
    dapp: state.dapp,
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
