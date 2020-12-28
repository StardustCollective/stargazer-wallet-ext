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

import MasterController, { IMasterController } from './controllers';
import { Runtime } from 'webextension-polyfill-ts';

declare global {
  interface Window {
    controller: Readonly<IMasterController>;
  }
}

// NOTE: API Examples
// dag.network.loadBalancerApi.getAddressBalance(ADDRESS)
// dag.network.blockExplorerApi.getTransactionsByAddress(ADDRESS)

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🤩', 'Stargazer extension installed');
});

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  if (
    port.sender &&
    port.sender.url &&
    port.sender.url?.includes(browser.runtime.getURL('/app.html'))
  ) {
    dag.di.useFetchHttpClient(window.fetch.bind(window));
    dag.di.useLocalStorageClient(localStorage);
    dag.network.config({
      id: DAG_CONFIG_ID,
      beUrl: DAG_BE_URL,
      lbUrl: DAG_LB_URL,
    });
  }
});

window.controller = Object.freeze(MasterController());

wrapStore(store, { portName: STORE_PORT });
