import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import authReducer from './auth/reducer';
import rootSaga from 'sagas/index';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
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
