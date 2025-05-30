import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { dag_accounts } from './dag_accounts';
import { ExternalRoute } from 'web/pages/External/types';

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
  await StargazerExternalPopups.executePopup({
    params: {
      data: null,
      message,
      origin: sender.origin,
      route: ExternalRoute.SelectAccounts,
    },
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
