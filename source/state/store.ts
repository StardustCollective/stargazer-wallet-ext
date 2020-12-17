import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Store,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import wallet from './wallet';
import { saveState, loadState } from './localStorage';

const store: Store = configureStore({
  reducer: combineReducers({
    wallet,
  }),
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    logger,
  ],
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState(),
});

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      auth: state.auth,
    });
  }, 1000)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
