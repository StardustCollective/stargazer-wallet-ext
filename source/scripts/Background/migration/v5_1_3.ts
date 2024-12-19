import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { IUserState } from 'state/user/types';

type V5_1_3State = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  user: IUserState;
  dapp: {};
  price: IPriceState;
  providers: IProvidersState;
  vault: IVaultState;
  swap: ISwapState;
};

const VERSION = '5.1.3';

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V5_1_3State = {
      ...oldState,
      user: {
        elpaca: {
          ...oldState.user.elpaca,
          hidden: false,
        },
      },
      vault: {
        ...oldState.vault,
        version: VERSION,
      },
    };
    await saveState(newState);
    console.log(`Migrate to <v${VERSION}> successfully!`);
    reload();
  } catch (error) {
    console.log(`<v${VERSION}> Migration Error`);
    console.log(error);
  }
};

export default MigrateRunner;
