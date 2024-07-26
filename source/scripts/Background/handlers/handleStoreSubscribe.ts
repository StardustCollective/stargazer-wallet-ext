import { Store } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { updateState } from 'state/store';

import { GlobalMessage, GlobalMessageEvent, MessageType } from '../messaging/types';

export const handleStoreSubscribe = (store: Store) => {
  const listener = throttle(async () => {
    const notifyUpdate = await updateState();
    if (notifyUpdate) {
      const message: GlobalMessage = {
        type: MessageType.global,
        event: GlobalMessageEvent.rehydrate,
      };
      await chrome.runtime.sendMessage(message);
    }
  }, 1000);

  // Subscribe store to updates
  store.subscribe(listener);
};
