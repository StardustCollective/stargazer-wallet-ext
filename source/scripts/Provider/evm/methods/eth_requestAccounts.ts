import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { eth_accounts } from './eth_accounts';

export const eth_requestAccounts = async (
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string[]> => {
  // Provider already activated -> return ETH accounts array
  if (dappProvider.activated) {
    return eth_accounts();
  }

  // Provider not activated -> display popup and wait for user's approval
  const connectWalletEvent = await dappProvider.createPopupAndWaitForMessage(
    port,
    ExternalMessageID.connectWallet,
    undefined,
    'selectAccounts'
  );

  // User rejected activation
  if (connectWalletEvent === null) {
    throw new EIPRpcError('User denied provider activation', EIPErrorCodes.Rejected);
  }

  // Return ETH accounts array
  return connectWalletEvent.detail.accounts;
};
