import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { dag_accounts } from './dag_accounts';

export const dag_requestAccounts = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  // Provider already activated -> return DAG accounts array
  if (isDappConnected(sender.origin)) {
    return dag_accounts(request, message, sender);
  }

  // Provider not activated -> display popup and wait for user's approval
  await StargazerExternalPopups.executePopupWithRequestMessage(
    null,
    message,
    sender.origin,
    'selectAccounts'
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
