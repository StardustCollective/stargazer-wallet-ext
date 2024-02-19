import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import {
  AVALANCHE_LOGO,
  AVALANCHE_NETWORK,
  DAG_NETWORK,
  ETH_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { saveState } from 'state/localStorage';

type V3_8_0ActiveNetworkState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  vault: IVaultState;
};

const avaxAsset = {
  id: AssetType.Avalanche,
  address: '',
  label: 'Avalanche',
  symbol: 'AVAX',
  type: AssetType.Ethereum,
  priceId: 'avalanche-2',
  network: 'avalanche-mainnet',
  logo: AVALANCHE_LOGO,
  decimals: 18,
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V3_8_0ActiveNetworkState = {
      ...oldState,
      assets: {
        ...oldState.assets,
        [AssetType.Avalanche]: avaxAsset,
      },
      vault: {
        ...oldState.vault,
        // activeNetwork shape changed
        activeNetwork: {
          [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
          [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
          Polygon: POLYGON_NETWORK.matic.id,
          Avalanche: AVALANCHE_NETWORK['avalanche-mainnet'].id,
        },
        balances: {
          ...oldState.vault.balances,
          [AssetType.Avalanche]: '0',
        },
        customNetworks: {
          constellation: {},
          ethereum: {},
        },
        version: '3.8.2',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.8.2> successfully!', newState);
    reload();
  } catch (error) {
    console.log('<v3.8.2> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
