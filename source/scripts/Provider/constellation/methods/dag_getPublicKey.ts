import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { getWalletInfo } from '../utils';
import { StargazerProxyRequest } from 'scripts/common';
import store from 'state/store';
import { IDAppState } from 'state/dapp/types';

export const dag_getPublicKey = (
  request: StargazerProxyRequest & { type: 'rpc' }
): string => {
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

  const { dapp } = store.getState();
  const { whitelist }: IDAppState = dapp;

  const current = dapp.current;
  const origin = current && current.origin;

  if (!origin) {
    throw new Error('ConstellationProvider.getPublicKey: No origin');
  }

  const dappData = whitelist[origin];

  if (!dappData?.accounts?.Constellation) {
    throw new Error('ConstellationProvider.getPublicKey: Not whitelisted');
  }

  return dag4.account.keyTrio.publicKey;
};
