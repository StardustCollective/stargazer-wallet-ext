import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';

export const eth_accounts = async (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  if (!isDappConnected(sender.origin)) return [];

  const { activeWallet } = getWalletInfo();

  if (!activeWallet || !activeWallet?.accounts) return [];

  const ethAccount = activeWallet?.accounts?.find(
    (account) => account?.network === KeyringNetwork.Ethereum
  );

  if (!ethAccount || !ethAccount?.address) return [];

  return [ethAccount.address];
};
