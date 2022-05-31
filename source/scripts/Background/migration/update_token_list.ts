import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import { initialState } from 'state/assets';
import { saveState } from 'state/localStorage';

export type V2WalletState = {
  assets: IAssetListState
  contacts: IContactBookState,
  dapp: {},
  price: IPriceState,
  vault: IVaultState
}

const MigrateRunner = async (oldState: V2WalletState): Promise<boolean> => {
  try {
    if (JSON.stringify(oldState.assets) === JSON.stringify(initialState)) {
      return false;
    }

    const newState = {
      ...oldState,
      assets: initialState
    };

    await saveState(newState);
    console.log('Updated asset list successfully!');
    reload();

    return true;
  } catch (error) {
    console.log('<AssetList> Migration Error');
    console.log(error);

    return false;
  }
};

export default MigrateRunner;
