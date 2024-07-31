import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { eth_accounts } from './eth_accounts';
import { EXTERNAL_URL, WINDOW_SIZE, WINDOW_TYPES } from '../utils';

export const eth_requestAccounts = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  // Provider already activated -> return ETH accounts array
  if (isDappConnected(sender.origin)) {
    return eth_accounts(request, message, sender);
  }

  // Provider not activated -> display popup and wait for user's approval
  await StargazerExternalPopups.executePopupWithRequestMessage(
    null,
    message,
    sender.origin,
    'selectAccounts',
    EXTERNAL_URL,
    WINDOW_SIZE.small,
    WINDOW_TYPES.popup
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
