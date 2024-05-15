import store from 'state/store';
import find from 'lodash/find';
import { IDAppState } from 'state/dapp/types';
import IVaultState from 'state/vault/types';

export const eth_accounts = async (): Promise<string[]> => {
  const { dapp, vault } = store.getState();
  const { whitelist }: IDAppState = dapp;

  const current = dapp.current;
  const origin = current && current.origin;

  if (!origin) {
    return [];
  }

  const dappData = whitelist[origin];

  if (!dappData?.accounts?.Ethereum) {
    return [];
  }

  const { activeWallet }: IVaultState = vault;

  if (!activeWallet) {
    return dappData.accounts.Ethereum;
  }

  const ethAddresses = dappData.accounts.Ethereum;
  const activeAddress = find(activeWallet.assets, { id: 'ethereum' });

  return [
    activeAddress?.address,
    ...ethAddresses.filter((address) => address !== activeAddress?.address),
  ].filter(Boolean); // if no active address, remove
};
