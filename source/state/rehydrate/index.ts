import { Store } from '@reduxjs/toolkit';
import { rehydrate as vaultRehydrate, getHasEncryptedVault } from '../vault';
import { rehydrate as assetsRehydrate } from '../assets';
import { rehydrate as contactsRehydrate } from '../contacts';
import { rehydrate as priceRehydrate } from '../price';
import { rehydrate as dappRehydrate } from '../dapp';
import { rehydrate as swapRehydrate } from '../swap';
import { rehydrate as biometricsRehydrate } from '../biometrics';

import { loadState } from '../localStorage';

const rehydrateStore = async (store: Store) => {
  const storageState = await loadState();

  if (storageState) {
    store.dispatch(vaultRehydrate(storageState.vault));
    store.dispatch(priceRehydrate(storageState.price));
    store.dispatch(assetsRehydrate(storageState.assets));
    store.dispatch(contactsRehydrate(storageState.contacts));
    store.dispatch(dappRehydrate(storageState.dapp));
    store.dispatch(swapRehydrate(storageState.swap));
    store.dispatch(biometricsRehydrate(storageState.biometrics));
  }
  await store.dispatch<any>(getHasEncryptedVault());
};

export default rehydrateStore;
