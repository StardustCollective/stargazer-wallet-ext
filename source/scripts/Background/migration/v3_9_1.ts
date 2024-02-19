import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { DAG_NETWORK } from 'constants/index';
import { saveState } from 'state/localStorage';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

type V3_9_0ActiveNetworkState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  vault: IVaultState;
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V3_9_0ActiveNetworkState = {
      ...oldState,
      vault: {
        ...oldState.vault,
        // activeNetwork shape changed
        activeNetwork: {
          ...oldState.vault.activeNetwork,
          [KeyringNetwork.Constellation]: DAG_NETWORK.main2.id,
        },
        version: '3.9.1',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.9.1> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.9.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
