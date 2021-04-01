/* eslint-disable prettier/prettier */
import 'emoji-log';
import { STORE_PORT, DAG_NETWORK } from 'constants/index';

import { browser } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';

import MasterController, { IMasterController } from './controllers';
import { Runtime } from 'webextension-polyfill-ts';
import { AssetType } from 'state/wallet/types';

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
  window.controller.stateUpdater();
});

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  if (
    port.sender &&
    port.sender.url &&
    port.sender.url?.includes(browser.runtime.getURL('/app.html'))
  ) {
    const networkId =
      store.getState().wallet!.activeNetwork[AssetType.Constellation] ||
      DAG_NETWORK.main.id;
    dag4.di.useFetchHttpClient(window.fetch.bind(window));
    dag4.di.useLocalStorageClient(localStorage);
    dag4.network.config({
      id: DAG_NETWORK[networkId].id,
      beUrl: DAG_NETWORK[networkId].beUrl,
      lbUrl: DAG_NETWORK[networkId].lbUrl,
    });
    dag4.monitor.startMonitor();
    window.controller.wallet.account.getLatestUpdate();
    window.controller.wallet.account.watchMemPool();
  }
});

if (!window.controller) {
  window.controller = Object.freeze(MasterController());
  setInterval(window.controller.stateUpdater, 3 * 60 * 1000);
}

wrapStore(store, { portName: STORE_PORT });
