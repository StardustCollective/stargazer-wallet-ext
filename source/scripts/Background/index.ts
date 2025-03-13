// Service worker initialization
// @ts-ignore - importScripts is available in service worker context
if (typeof importScripts === 'function') {

  // Handle WebAssembly loading errors
  self.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection in service worker:', event.reason);
  });

  // Initialize WebAssembly support
  self.addEventListener('install', (event) => {
    // Skip waiting to activate the service worker immediately
    // @ts-ignore
    self.skipWaiting();
    console.log('Service worker installed', event);
  });

  self.addEventListener('activate', (event) => {
    console.log('Service worker activated', event);
  });
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
