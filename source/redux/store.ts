import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';
import logger from 'redux-logger';
import rootSaga from 'sagas/index';

import authReducer from './auth/reducer';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: localStorage,
  version: 1,
};

const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      auth: authReducer,
    })
  ),
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    sagaMiddleware,
    logger,
  ],
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default store;
