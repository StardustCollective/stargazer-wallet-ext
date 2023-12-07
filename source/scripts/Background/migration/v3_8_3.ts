import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType, Network } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { BSC_LOGO, BSC_NETWORK } from 'constants/index';
import { saveState } from 'state/localStorage';

type V3_8_0ActiveNetworkState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  vault: IVaultState;
};

const bscAsset = {
  id: AssetType.BSC,
  address: '',
  label: 'BNB',
  symbol: 'BNB',
  type: AssetType.Ethereum,
  priceId: 'binancecoin',
  network: 'bsc',
  logo: BSC_LOGO,
  decimals: 18,
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V3_8_0ActiveNetworkState = {
      ...oldState,
      assets: {
        ...oldState.assets,
        [AssetType.BSC]: bscAsset,
      },
      vault: {
        ...oldState.vault,
        // activeNetwork shape changed
        activeNetwork: {
          ...oldState.vault.activeNetwork,
          [Network.BSC]: BSC_NETWORK.bsc.id,
        },
        balances: {
          ...oldState.vault.balances,
          [AssetType.BSC]: '0',
        },
        customNetworks: {
          constellation: {},
          ethereum: {},
        },
        version: '3.8.3',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.8.3> successfully!', newState);
    reload();
  } catch (error) {
    console.log('<v3.8.3> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
