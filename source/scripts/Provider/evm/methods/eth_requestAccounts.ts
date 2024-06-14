import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { eth_accounts } from './eth_accounts';
import { sessionExpired } from 'utils/keyring';
import { getWalletInfo } from '../utils';

export const eth_requestAccounts = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  // Check if wallet is unlocked
  const expired = await sessionExpired();

  // Provider already activated -> return ETH accounts array
  if (isDappConnected(sender.origin) && !expired) {
    return eth_accounts(request, message, sender);
  }

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  // Provider not activated -> display popup and wait for user's approval
  await StargazerExternalPopups.executePopupWithRequestMessage(
    null,
    message,
    sender.origin,
    'selectAccounts',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
