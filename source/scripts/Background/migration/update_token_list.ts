import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import { saveState } from 'state/localStorage';

export type V2WalletState = {
  assets: IAssetListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  vault: IVaultState;
};

const MigrateRunner = async (oldState: any): Promise<boolean> => {
  try {
    const newState = {
      ...oldState,
      assets: oldState.assets,
      vault: {
        ...oldState.vault,
        activeWallet: {
          ...oldState.vault.activeWallet,
          assets: oldState.vault.activeWallet.assets,
        },
      },
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
