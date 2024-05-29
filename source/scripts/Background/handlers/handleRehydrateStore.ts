import rehydrateStore from 'state/rehydrate';
import store from 'state/store';
import {
  GlobalMessage,
  GlobalMessageEvent,
  MessageType,
} from 'scripts/Background/messaging/types';
import { handleDag4Setup } from './handleDag4Setup';

const handleRehydrateMessage = async (message: GlobalMessage) => {
  if (!message || !message?.type || !message?.event) return;
  if (message.type !== MessageType.global) return;
  if (message.event !== GlobalMessageEvent.rehydrate) return;

  await rehydrateStore(store).then(() => {
    handleDag4Setup(store);
  });
};

export const handleRehydrateStore = () => {
  chrome.runtime.onMessage.addListener(handleRehydrateMessage);
};
