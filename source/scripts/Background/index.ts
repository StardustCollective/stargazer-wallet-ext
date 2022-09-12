import { browser, Runtime } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import 'emoji-log';

import { STORE_PORT, DAG_NETWORK } from 'constants/index';
import store from 'state/store';

import { MasterController } from './controllers';

declare global {
  interface Window {
    controller: MasterController;
  }
}

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🤩', 'Stargazer extension installed');
});

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  if (
    port.sender?.url?.includes(browser.runtime.getURL('/app.html')) ||
    port.sender?.url?.includes(browser.runtime.getURL('/external.html'))
  ) {
    const vault = store.getState().vault;
    const networkId =
      vault && vault.activeNetwork && vault.activeNetwork[KeyringNetwork.Constellation];
    const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main;
    dag4.di.getStateStorageDb().setPrefix('stargazer-');
    dag4.di.useLocalStorageClient(localStorage);
    dag4.account.connect({
      networkVersion: networkInfo.version,
      ...networkInfo.config,
    }, false);

    port.onDisconnect.addListener(() => {
      console.log('onDisconnect');
      window.controller.wallet.account.assetsBalanceMonitor.stop();
    });

    console.log('onConnect');
    if (window.controller.wallet.isUnlocked()) {
      window.controller.wallet.account.assetsBalanceMonitor.start();
      window.controller.wallet.account.getLatestTxUpdate();
    }
  }
});

if (!window.controller) {
  window.controller = new MasterController();
}

wrapStore(store, { portName: STORE_PORT });
