import type { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { stargazer_accounts } from './stargazer_accounts';
import { ExternalRoute } from 'web/pages/External/types';

export const stargazer_requestAccounts = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
// Provider already activated -> return all accounts
if (isDappConnected(sender.origin)) {
  return stargazer_accounts(request, message, sender);
}

// Provider not activated -> display popup and wait for user's approval
await StargazerExternalPopups.executePopup({
  params: {
    data: {
      origin: 'stargazer_requestAccounts',
    },
    message,
    origin: sender.origin,
    route: ExternalRoute.SelectAccounts,
  },
});

return StargazerWSMessageBroker.NoResponseEmitted;
};
