import type { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import store from 'state/store';

interface WalletAccount {
  type: 'constellation' | 'ethereum';
  address: string;
  active: boolean;
}

export const stargazer_requestAccounts = async (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
): Promise<WalletAccount[]> => {

  const { vault } = store.getState();

  if (!vault.activeWallet) {
    throw new Error('There is no active wallet');
  }

  if (!vault.wallets) {
    throw new Error('There are no wallets');
  }
  const { activeWallet } = vault;
  const allWallets = [...vault.wallets.local, ...vault.wallets.ledger, ...vault.wallets.bitfi, ...vault.wallets.cypherock];
  const activeWalletAddresses = activeWallet?.accounts?.map(account => account.address) || [];
  const accounts: WalletAccount[] = [];

  for (const wallet of allWallets) {
    if (!wallet?.accounts) continue;

    for (const account of wallet.accounts) {
      if (!account?.address) continue;

      const isDAG = account.network === KeyringNetwork.Constellation;
      const isEVM = account.network === KeyringNetwork.Ethereum;

      if (!isDAG && !isEVM) continue;

      const walletAccount: WalletAccount = {
        type: isDAG ? 'constellation' : 'ethereum',
        address: account.address,
        active: activeWalletAddresses.includes(account.address),
      }

      accounts.push(walletAccount);
    }
  }

  return accounts;
};
