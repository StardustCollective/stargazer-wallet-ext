import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootSaga from 'sagas/index';
import throttle from 'lodash/throttle';

import authReducer from './auth/reducer';
import { saveState, loadState } from './localStorage';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
  }),
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    sagaMiddleware,
    logger,
  ],
  preloadedState: loadState(),
});

store.subscribe(
  throttle(() => {
    const currentState = store.getState();
    saveState({
      auth: currentState.auth,
    });
  }, 1000)
);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
