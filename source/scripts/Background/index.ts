// Service worker initialization
// @ts-ignore - importScripts is available in service worker context
if (typeof importScripts === 'function') {
  // Handle WebAssembly loading errors
  self.addEventListener('unhandledrejection', () => {});

  // Initialize WebAssembly support
  self.addEventListener('install', () => {
    // Skip waiting to activate the service worker immediately
    // @ts-ignore
    self.skipWaiting();
  });

  self.addEventListener('activate', () => {});
}

import store from 'state/store';
import rehydrateStore from 'state/rehydrate';

import { handleInstall } from './handlers/handleInstall';
import { handleDag4Setup } from './handlers/handleDag4Setup';
import { handleDappMessages } from './handlers/handleDappMessages';
import { handleRehydrateStore } from './handlers/handleRehydrateStore';
import { handleStoreSubscribe } from './handlers/handleStoreSubscribe';
import { handleBrokerMessages } from './handlers/handleBrokerMessages';

rehydrateStore(store).then(() => {
  handleDag4Setup(store);
  handleStoreSubscribe(store);
});

handleInstall();
handleRehydrateStore();
handleDappMessages();
handleBrokerMessages();
