import { rehydrate as vaultRehydrate, getHasEncryptedVault } from '../vault';
import { rehydrate as assetsRehydrate } from '../assets';
import { rehydrate as contactsRehydrate } from '../contacts';
import { rehydrate as priceRehydrate } from '../price';
import { rehydrate as nftsRehydrate } from '../nfts';
import { rehydrate as dappRehydrate } from '../dapp';

import { loadState } from '../localStorage';

const rehydrateStore = async (store) => {
  const storageState = await loadState();
  console.log('storageState::::', storageState);

  // await store.dispatch(getHasEncryptedVault());

  if (storageState) {
    store.dispatch(vaultRehydrate(storageState.vault));
    store.dispatch(assetsRehydrate({}));
    store.dispatch(contactsRehydrate(storageState.contacts));
    store.dispatch(priceRehydrate(storageState.price));
    store.dispatch(nftsRehydrate(storageState.nfts));
    store.dispatch(dappRehydrate(storageState.dapp));
  }
};

export default rehydrateStore;
