import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import ISwapState from 'state/swap/types';
import { initialState as swapInitialState } from 'state/swap';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';

type V3_10_0ActiveNetworkState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  providers: IProvidersState;
  vault: IVaultState;
  swap: ISwapState;
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V3_10_0ActiveNetworkState = {
      ...oldState,
      vault: {
        ...oldState.vault,
        version: '3.10.0',
      },
      swap: {
        ...swapInitialState,
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.10.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.10.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
