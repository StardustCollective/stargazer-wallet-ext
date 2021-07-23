/* eslint-disable prettier/prettier */
import 'emoji-log';
import { STORE_PORT, DAG_NETWORK } from 'constants/index';

import { browser } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';

import MasterController, { IMasterController } from './controllers';
import { Runtime } from 'webextension-polyfill-ts';
import { messagesHandler } from './controllers/MessageHandler';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

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
    const vault = store.getState().vault;
    const networkId = (vault && vault.activeNetwork && vault.activeNetwork[KeyringNetwork.Constellation]);
    const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main;
    dag4.di.getStateStorageDb().setPrefix('stargazer-');
    dag4.di.useFetchHttpClient(window.fetch.bind(window));
    dag4.di.useLocalStorageClient(localStorage);
    dag4.network.config({
      id: networkInfo.id,
      beUrl: networkInfo.beUrl,
      lbUrl: networkInfo.lbUrl
    });

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
