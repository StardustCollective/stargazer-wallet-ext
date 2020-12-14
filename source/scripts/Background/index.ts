/* eslint-disable prettier/prettier */
import 'emoji-log';
import { browser } from 'webextension-polyfill-ts';
import { wrapStore } from 'webext-redux';
import store from 'state/store';
import { STORE_PORT } from 'source/constants';

import MasterController, { IMasterController } from './controllers';

declare global {
  interface Window {
    controller: Readonly<IMasterController>;
  }
}

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🤩', 'Stargazer extension installed');
});

window.controller = Object.freeze(MasterController());

wrapStore(store, { portName: STORE_PORT });
