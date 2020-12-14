import { STORE_PORT } from 'constants/index';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

import App from './App';

const app = document.getElementById('app-root');
const store = new Store({ portName: STORE_PORT });

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
