import { Store } from '@reduxjs/toolkit';
import { dag4 } from '@stardust-collective/dag4';
import localStorage from 'utils/localStorage';
import { DAG_NETWORK } from 'constants/index';

const DAG4_PREFIX = 'stargazer-';

export const handleDag4Setup = (store: Store) => {
  // Get network info from store
  const { vault } = store.getState();
  const networkId = vault?.activeNetwork?.Constellation ?? null;
  const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main2;

  // Setup dag4.js
  dag4.di.getStateStorageDb().setPrefix(DAG4_PREFIX);
  dag4.di.useLocalStorageClient(localStorage);
  dag4.account.connect(
    {
      id: networkInfo.id,
      networkVersion: networkInfo.version,
      ...networkInfo.config,
    },
    false
  );
};
