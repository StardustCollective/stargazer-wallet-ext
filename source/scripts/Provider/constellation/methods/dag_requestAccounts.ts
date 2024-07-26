import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { dag_accounts } from './dag_accounts';
import { sessionExpired } from 'utils/keyring';
import { EXTERNAL_URL, WINDOW_SIZE, WINDOW_TYPES } from '../utils';

export const dag_requestAccounts = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  // Check if wallet is unlocked
  const expired = await sessionExpired();

  // Provider already activated -> return DAG accounts array
  if (isDappConnected(sender.origin) && !expired) {
    return dag_accounts(request, message, sender);
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
