import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { dag_accounts } from './dag_accounts';

export const dag_requestAccounts = async (
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string[]> => {
  // Provider already activated -> return DAG accounts array
  if (dappProvider.activated) {
    return dag_accounts();
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
    throw new Error('User denied provider activation');
  }

  // Return DAG accounts array
  return connectWalletEvent.detail.accounts;
};
