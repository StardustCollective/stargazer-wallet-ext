import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import thunkMiddleware from 'redux-thunk';
import { dag } from '@stardust-collective/dag-wallet-sdk';
import {
  DAG_CONFIG_ID,
  STORE_PORT,
  DAG_BE_URL,
  DAG_LB_URL,
} from 'source/constants';

import { FetchRestService } from '../../services/fetch.http';

import App from './App';

dag.di.registerHttpClient(new FetchRestService());
dag.network.config({
  id: DAG_CONFIG_ID,
  beUrl: DAG_BE_URL,
  lbUrl: DAG_LB_URL,
});

// NOTE: API Examples
// dag.network.loadBalancerApi.getAddressBalance(ADDRESS)
// dag.network.blockExplorerApi.getTransactionsByAddress(ADDRESS)

const app = document.getElementById('app-root');
const middleware = [thunkMiddleware];
const store = new Store({ portName: STORE_PORT });
applyMiddleware(store, ...middleware);

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
