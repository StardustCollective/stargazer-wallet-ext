import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { CONSTELLATION_LOGO, DOR_LOGO } from 'constants/index';

type V5_2_1State = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  user: any;
  dapp: {};
  price: IPriceState;
  providers: IProvidersState;
  vault: IVaultState;
  swap: ISwapState;
};

const VERSION = '5.3.0';

const DOR_ID = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
const DOR_dL1_ENDPOINT = 'http://dl1-lb-mainnet.getdor.com:9000';

const DAG_BASE_ASSET = {
  '0x74299A718b2c44483a27325d7725F0B2646DE3B1-base-mainnet': {
    id: '0x74299A718b2c44483a27325d7725F0B2646DE3B1-base-mainnet',
    address: '0x74299A718b2c44483a27325d7725F0B2646DE3B1',
    label: 'Base DAG',
    symbol: 'BASE_DAG',
    type: AssetType.ERC20,
    priceId: '',
    network: 'base-mainnet',
    logo: CONSTELLATION_LOGO,
    decimals: 8,
  },
};

const DOR_BASE_ASSET = {
  '0xfe9885baff18074846aaa2d5541581adf068731d-base-mainnet': {
    id: '0xfe9885baff18074846aaa2d5541581adf068731d-base-mainnet',
    address: '0xfe9885baff18074846aaa2d5541581adf068731d',
    label: 'Base DOR',
    symbol: 'BASE_DOR',
    type: AssetType.ERC20,
    priceId: '',
    network: 'base-mainnet',
    logo: DOR_LOGO,
    decimals: 8,
  },
};

function updateAssets(assets: IAssetListState, updates: { [key: string]: any }) {
  // Create a copy of the assets to avoid modifying the original object
  const updatedAssets: any = { ...assets };

  // Iterate over the keys in the updates object
  Object.keys(updates).forEach((key) => {
    if (updatedAssets[key]) {
      // Iterate over each property in the updates for the current key
      Object.keys(updates[key]).forEach((property: any) => {
        // Update the property for the asset
        updatedAssets[key][property] = updates[key][property];
      });
    }
  });

  return updatedAssets;
}

const MigrateRunner = async (oldState: any) => {
  const assetsUpdated = updateAssets(oldState.assets, {
    [DOR_ID]: {
      dl1endpoint: DOR_dL1_ENDPOINT,
    }
  });
  try {
    const newState: V5_2_1State = {
      ...oldState,
      assets: {
        ...assetsUpdated,
        ...DAG_BASE_ASSET,
        ...DOR_BASE_ASSET,
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
