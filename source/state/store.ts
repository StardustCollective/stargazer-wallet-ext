import { combineReducers, configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import vault from './vault';
import price from './price';
import contacts from './contacts';
import assets from './assets';
import nfts from './nfts';

import dapp from './dapp';
import { saveState } from './localStorage';

const middleware = [...getDefaultMiddleware({ thunk: false, serializableCheck: false })];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = persistCombineReducers(persistConfig, {
  vault,
  price,
  contacts,
  assets,
  nfts,
  dapp,
  // vault: persistReducer(persistConfig, vault),
  // price: persistReducer(persistConfig, price),
  // contacts: persistReducer(persistConfig, contacts),
  // assets: persistReducer(persistConfig, assets),
  // nfts: persistReducer(persistConfig, nfts),
  // dapp: persistReducer(persistConfig, dapp),
});

const store: Store = configureStore({
  reducer: rootReducer,
  // reducer: combineReducers({
  // vault: persistReducer(persistConfig, vault),
  // price: persistReducer(persistConfig, price),
  // contacts: persistReducer(persistConfig, contacts),
  // assets: persistReducer(persistConfig, assets),
  // nfts: persistReducer(persistConfig, nfts),
  // dapp: persistReducer(persistConfig, dapp),
  // vault,
  // price,
  // contacts,
  // assets,
  // nfts,
  // dapp,
  // }),
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  // preloadedState,
});

function updateState() {
  const state = store.getState();

  console.log('wat is state in update state', state);

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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
