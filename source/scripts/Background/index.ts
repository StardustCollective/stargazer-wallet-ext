/* eslint-disable prettier/prettier */
import 'emoji-log';
import {
  STORE_PORT,
  DAG_CONFIG_ID,
  DAG_BE_URL,
  DAG_LB_URL,
} from 'constants/index';

import { browser } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import store from 'state/store';
import { dag } from '@stardust-collective/dag4-wallet';
import { FetchRestService } from 'services/fetch.http';

import MasterController, { IMasterController } from './controllers';

declare global {
  interface Window {
    controller: Readonly<IMasterController>;
  }
}

// NOTE: API Examples
// dag.network.loadBalancerApi.getAddressBalance(ADDRESS)
// dag.network.blockExplorerApi.getTransactionsByAddress(ADDRESS)

browser.runtime.onInstalled.addListener((): void => {
  dag.di.registerHttpClient(new FetchRestService());
  dag.network.config({
    id: DAG_CONFIG_ID,
    beUrl: DAG_BE_URL,
    lbUrl: DAG_LB_URL,
  });
  console.log(dag.network.getNetwork());
  console.emoji('🤩', 'Stargazer extension installed');
});

window.controller = Object.freeze(MasterController());

wrapStore(store, { portName: STORE_PORT });
