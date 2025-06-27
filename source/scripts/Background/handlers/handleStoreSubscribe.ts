import { Store } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { updateState } from 'state/store';

import { type GlobalMessage, GlobalMessageEvent, MessageType } from '../messaging/types';
import { cacheConfig } from './handleRehydrateStore';
import { isNative } from 'utils/envUtil';

export const updateAndNotify = async () => {
  const notifyUpdate = await updateState();
  if (notifyUpdate) {
    const message: GlobalMessage = {
      type: MessageType.global,
      event: GlobalMessageEvent.rehydrate,
    };

    try {
      if (!isNative) {
        await chrome.runtime.sendMessage(message);
      }
    } catch (err) {
      console.error(err);
      // NOOP
    }
  }
};

export const handleStoreSubscribe = (store: Store) => {
  const listener = throttle(async () => {
    if (cacheConfig.waitRehydrate) return;

    await updateAndNotify();
  }, 1000);

  // Subscribe store to updates
  store.subscribe(listener);
};
