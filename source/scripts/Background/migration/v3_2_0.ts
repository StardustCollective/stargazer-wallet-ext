import { browser } from 'webextension-polyfill-ts';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import { initialState } from 'state/assets';

export type V2WalletState = {
  assets: IAssetListState
  contacts: IContactBookState,
  dapp: {},
  price: IPriceState,
  vault: IVaultState
}

const MigrateRunner = (oldState: V2WalletState) => {
  try {
    const newState = {
      ...oldState,
      assets: initialState
    };

    localStorage.setItem('state', JSON.stringify(newState));
    console.emoji('✅', 'Migrate to <v3.2.0> successfully!');
    browser.runtime.reload();
  } catch (error) {
    console.emoji('🔺', '<v3.2.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
