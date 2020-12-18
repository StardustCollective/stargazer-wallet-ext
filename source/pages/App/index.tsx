import { STORE_PORT } from 'constants/index';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import watch from 'redux-watch';
import { WalletStatus } from 'state/wallet/consts';
import { updateStatus } from 'state/wallet';
import appStore from 'state/store';

import App from './App';

const app = document.getElementById('app-root');
const store = new Store({ portName: STORE_PORT });

const w = watch(appStore.getState, 'wallet.status');
store.subscribe(
  w((newVal: WalletStatus, oldVal: WalletStatus) => {
    if (newVal === WalletStatus.CHANGED && oldVal === WalletStatus.NONE) {
      store.dispatch(updateStatus(WalletStatus.NONE));
      location.reload();
    }
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
