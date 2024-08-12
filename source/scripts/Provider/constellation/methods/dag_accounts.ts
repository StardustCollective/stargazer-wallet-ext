import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { getWalletInfo } from '../utils';

export const dag_accounts = (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet || !activeWallet?.accounts) return [];

  const dagAccount = activeWallet?.accounts?.find(
    (account) => account?.network === KeyringNetwork.Constellation
  );

  if (!dagAccount || !dagAccount?.address) return [];

  return [dagAccount.address];
};
