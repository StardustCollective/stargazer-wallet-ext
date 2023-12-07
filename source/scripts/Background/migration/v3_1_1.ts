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

const MigrateRunner = async (oldState: V2WalletState) => {
  try {
    const newState = {
      ...oldState,
      dapp: {
        whitelist: {},
        listening: {},
      },
    };

    await saveState(newState);
    console.log('Migrate to <v3.1.1> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.1.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
