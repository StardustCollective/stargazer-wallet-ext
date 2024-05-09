import rehydrateStore from 'state/rehydrate';
import store from 'state/store';
import { handleDag4Setup } from './handleDag4Setup';
import {
  GlobalMessage,
  GlobalMessageID,
  MessageType,
} from 'scripts/Background/messaging/types';

const handleRehydrateMessage = async (message: GlobalMessage) => {
  if (!message || !message?.type || !message?.id) return;
  if (message.type !== MessageType.global) return;
  if (message.id !== GlobalMessageID.rehydrate) return;

  await rehydrateStore(store).then(() => {
    handleDag4Setup(store);
  });
};

export const handleRehydrateStore = () => {
  chrome.runtime.onMessage.addListener(handleRehydrateMessage);
};
