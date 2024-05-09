import {
  DappMessageID,
  MessageDetail,
  ExternalMessageID,
  MessageType,
  GlobalMessageID,
} from './types';

export const sendMessage = async (id: GlobalMessageID, payload?: any) => {
  await chrome.runtime.sendMessage({ type: MessageType.global, id, payload });
};

export const sendExternalMessage = async (
  id: ExternalMessageID,
  detail: MessageDetail
) => {
  await chrome.runtime.sendMessage({ type: MessageType.external, id, detail });
};

export const sendDappMessage = async (id: DappMessageID, payload: any) => {
  await chrome.runtime.sendMessage({ type: MessageType.dapp, id, payload });
};
