import { reload } from 'utils/browser';import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import {INFTListState} from 'state/nfts/types';
import { saveState } from 'state/localStorage';

type V2WalletState = {
  assets: IAssetListState
  contacts: IContactBookState,
  dapp: {},
  price: IPriceState,
  vault:  IVaultState
}

type V2_3WalletState = {
  assets: IAssetListState
  nfts: INFTListState,
  contacts: IContactBookState,
  dapp: {},
  price: IPriceState,
  vault:  IVaultState
}

const MigrateRunner = async (oldState: V2WalletState) => {
  try {
    const newState: V2_3WalletState = {
      ...oldState,
      nfts: {}
    };

    await saveState(newState);
    console.log('Migrate to <v3.3.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.3.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
