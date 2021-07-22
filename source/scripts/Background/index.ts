/* eslint-disable prettier/prettier */
import 'emoji-log';
import { STORE_PORT, DAG_NETWORK } from 'constants/index';

import { browser } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';

import MasterController, { IMasterController } from './controllers';
import { Runtime } from 'webextension-polyfill-ts';
import { AssetType } from 'state/vault/types';
import { messagesHandler } from './controllers/MessageHandler';

declare global {
  interface Window {
    controller: Readonly<IMasterController>;
  }
}

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🤩', 'Stargazer extension installed');
});

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  if (port.name === 'stargazer') {
    messagesHandler(port, window.controller);
  }
  else if (
    port.sender &&
    port.sender.url &&
    port.sender.url?.includes(browser.runtime.getURL('/app.html'))
  ) {
    //TODO: implement fallback URLs
    const networkId =
      store.getState().vault!.activeNetwork[AssetType.Constellation] ||
      DAG_NETWORK.main.id;
    dag4.di.useFetchHttpClient(window.fetch.bind(window));
    dag4.di.useLocalStorageClient(localStorage);
    dag4.network.config({
      id: DAG_NETWORK[networkId].id,
      beUrl: DAG_NETWORK[networkId].beUrl,
      lbUrl: DAG_NETWORK[networkId].lbUrl
    });
    //TODO - startMonitor doesn't help if there is no account logged in to
    dag4.monitor.startMonitor();
    //window.controller.wallet.account.getLatestUpdate();

    //TODO - Instead of this, Use AccountWatcher and on wallet init, watch the account for txs and balance changes
    // window.controller.wallet.account.watchMemPool();

    port.onDisconnect.addListener(() => {
      console.log('onDisconnect');
      window.controller.wallet.account.assetsBalanceMonitor.stop();
    });

    console.log('onConnect');
    if (window.controller.wallet.isUnlocked()) {
      window.controller.wallet.account.assetsBalanceMonitor.start();
    }
  }
});

if (!window.controller) {
  window.controller = MasterController();
}

wrapStore(store, { portName: STORE_PORT });
