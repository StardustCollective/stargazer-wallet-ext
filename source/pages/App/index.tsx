import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import thunkMiddleware from 'redux-thunk';
import { dag } from '@stardust-collective/dag-wallet-sdk';

import { FetchRestService } from '../../services/fetch.http';

import App from './App';

const BE_URL = 'https://block-explorer.constellationnetwork.io';
const LB_URL = 'http://lb.constellationnetwork.io:9000';

dag.di.registerHttpClient(new FetchRestService());
dag.network.config({
  id: 'main',
  beUrl: BE_URL,
  lbUrl: LB_URL,
});

// NOTE: API Examples
// dag.network.loadBalancerApi.getAddressBalance(ADDRESS)
// dag.network.blockExplorerApi.getTransactionsByAddress(ADDRESS)

const app = document.getElementById('app-root');
const middleware = [thunkMiddleware];
const store = new Store({ portName: 'STARGAZER' });
applyMiddleware(store, ...middleware);

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
