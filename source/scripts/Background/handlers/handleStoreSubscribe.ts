import { Store } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { updateState } from 'state/store';

import { GlobalMessageEvent } from '../messaging/types';

export const handleStoreSubscribe = (store: Store) => {
  const listener = throttle(async () => {
    const notifyUpdate = await updateState();
    if (notifyUpdate) {
      // Service Worker
      await chrome.runtime.sendMessage(GlobalMessageEvent.rehydrate);
    }
  }, 1000);

  // Subscribe store to updates
  store.subscribe(listener);
};
