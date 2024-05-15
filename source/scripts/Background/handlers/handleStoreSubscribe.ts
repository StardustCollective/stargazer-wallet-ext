import { Store } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { updateState } from 'state/store';
import { sendMessage } from '../messaging/messenger';
import { GlobalMessageID } from '../messaging/types';

export const handleStoreSubscribe = (store: Store) => {
  const listener = throttle(async () => {
    const notifyUpdate = await updateState();
    if (notifyUpdate) {
      await sendMessage(GlobalMessageID.rehydrate);
    }
  }, 1000);

  // Subscribe store to updates
  store.subscribe(listener);
};
