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

chrome.runtime.onInstalled.addListener((): void => {
  console.emoji('🤩', 'Stargazer extension installed');
});

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  if (
    port.sender?.url?.includes(chrome.runtime.getURL('/app.html')) ||
    port.sender?.url?.includes(chrome.runtime.getURL('/external.html'))
  ) {
    const vault = store.getState().vault;
    const networkId =
      vault && vault.activeNetwork && vault.activeNetwork[KeyringNetwork.Constellation];
    const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main2;
    dag4.di.getStateStorageDb().setPrefix('stargazer-');
    dag4.di.useLocalStorageClient(localStorage);
    dag4.account.connect(
      {
        id: networkInfo.id,
        networkVersion: networkInfo.version,
        ...networkInfo.config,
      },
      false
    );

    port.onDisconnect.addListener(() => {
      console.log('onDisconnect');
      // TODO: test Manifest V3 (window object not available)
      // window.controller.wallet.account.assetsBalanceMonitor.stop();
    });

    console.log('onConnect');
    const isUnlocked = false;
    // TODO: test Manifest V3 (window object not available)
    // const isUnlocked = window.controller.wallet.isUnlocked();
    if (isUnlocked) {
      // window.controller.wallet.account.assetsBalanceMonitor.start();
      // window.controller.wallet.account.getLatestTxUpdate();
    }
  }
});

// TODO: test Manifest V3 (window object not available)
// if (!window.controller) {
//   window.controller = new MasterController();
// }

wrapStore(store, { portName: STORE_PORT });
