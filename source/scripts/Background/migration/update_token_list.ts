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

const MigrateRunner = (oldState: V2WalletState): Boolean => {
  try {
    if (JSON.stringify(oldState.assets) === JSON.stringify(initialState)) {
      return false;
    }

    const newState = {
      ...oldState,
      assets: initialState
    };

    localStorage.setItem('state', JSON.stringify(newState));
    console.emoji('✅', 'Updated asset list successfully!');
    browser.runtime.reload();

    return true;
  } catch (error) {
    console.emoji('🔺', '<AssetList> Migration Error');
    console.log(error);

    return false;
  }
};

export default MigrateRunner;
