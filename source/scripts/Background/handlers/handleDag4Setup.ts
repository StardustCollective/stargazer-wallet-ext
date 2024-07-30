import { Store } from '@reduxjs/toolkit';
import { dag4 } from '@stardust-collective/dag4';
import localStorage from 'utils/localStorage';
import { DAG_NETWORK } from 'constants/index';
import IVaultState from 'state/vault/types';

const DAG4_PREFIX = 'stargazer-';

export const handleDag4Setup = (store: Store) => {
  // Get network info from store
  const vault: IVaultState = store.getState().vault;
  const pubKey = vault?.publicKey ?? null;
  const networkId = vault?.activeNetwork?.Constellation ?? null;
  const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main2;

  // Setup dag4.js
  dag4.di.getStateStorageDb().setPrefix(DAG4_PREFIX);
  dag4.di.useLocalStorageClient(localStorage);
  const fetchClient = async (url: string, options: any) => {
    return globalThis.fetch(url, options);
  };
  dag4.di.useFetchHttpClient(fetchClient);
  dag4.account.connect(
    {
      id: networkInfo.id,
      networkVersion: networkInfo.version,
      ...networkInfo.config,
    },
    false
  );

  // Do NOT login with public key if already logged with private key
  if (pubKey && !dag4.account.isActive() && !dag4?.account?.keyTrio?.privateKey) {
    dag4.account.loginPublicKey(pubKey);
  }
};
