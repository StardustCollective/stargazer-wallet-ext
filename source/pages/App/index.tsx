import { STORE_PORT } from 'constants/index';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import watch from 'redux-watch';
import appStore from 'state/store';

import App from './App';

const app = document.getElementById('app-root');
const store = new Store({ portName: STORE_PORT });

const w = watch(appStore.getState, 'wallet.status');
store.subscribe(
  w(() => {
    location.reload();
  })
);

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
