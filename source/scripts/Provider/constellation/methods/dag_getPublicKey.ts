import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import store from 'state/store';
import { getWalletInfo } from '../utils';

export const dag_getPublicKey = (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { activeWallet } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  const [address] = request.params as [string];

  if (!dag4.account.validateDagAddress(address)) {
    throw new Error("Bad argument 'address'");
  }

  if (assetAccount.address !== address) {
    throw new Error('The active account is not the requested');
  }

  const { whitelist } = store.getState().dapp;

  if (!whitelist[sender.origin]) {
    throw new Error('ConstellationProvider.getPublicKey: Not whitelisted');
  }

  if (!dag4.account?.keyTrio?.publicKey) {
    throw new Error('Public key not found');
  }

  return dag4.account.keyTrio.publicKey;
};
