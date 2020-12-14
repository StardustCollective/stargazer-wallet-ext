import {
  DAG_CONFIG_ID,
  STORE_PORT,
  DAG_BE_URL,
  DAG_LB_URL,
} from 'constants/index';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { dag } from '@stardust-collective/dag-wallet-sdk';

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
const store = new Store({ portName: STORE_PORT });

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
