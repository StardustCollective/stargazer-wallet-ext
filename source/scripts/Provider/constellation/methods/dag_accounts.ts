import store from 'state/store';
import find from 'lodash/find';
import { IDAppState } from 'state/dapp/types';
import IVaultState from 'state/vault/types';

export const dag_accounts = (): string[] => {
  const { dapp, vault } = store.getState();
  const { whitelist }: IDAppState = dapp;

  const current = dapp.current;
  const origin = current && current.origin;

  if (!origin) {
    return [];
  }

  const dappData = whitelist[origin];

  if (!dappData?.accounts?.Constellation) {
    return [];
  }

  const { activeWallet }: IVaultState = vault;

  if (!activeWallet) {
    return dappData.accounts.Constellation;
  }

  const dagAddresses = dappData.accounts.Constellation;
  const activeAddress = find(activeWallet.assets, { id: 'constellation' });

  return [
    activeAddress?.address,
    ...dagAddresses.filter((address) => address !== activeAddress?.address),
  ].filter(Boolean); // if no active address, remove
};