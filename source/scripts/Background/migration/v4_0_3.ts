import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';

type V3_11_1ActiveNetworkState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  providers: IProvidersState;
  vault: IVaultState;
  swap: ISwapState;
};

const addPropertyToAssets = (
  assets: IAssetListState,
  assetKey: string,
  property: object
) => {
  const assetInfo = assets[assetKey];
  if (!assetInfo) return assets;

  const assetWithProperty = {
    ...assetInfo,
    ...property,
  };

  const assetsUpdated = {
    ...assets,
    [assetKey]: assetWithProperty,
  };

  return assetsUpdated;
};

const MigrateRunner = async (oldState: any) => {
  const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
  const assetsUpdated = addPropertyToAssets(oldState.assets, DOR_ASSET_KEY, {
    priceId: 'dor',
  });
  try {
    const newState: V3_11_1ActiveNetworkState = {
      ...oldState,
      assets: assetsUpdated,
      vault: {
        ...oldState.vault,
        version: '4.0.3',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v4.0.3> successfully!');
    reload();
  } catch (error) {
    console.log('<v4.0.3> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
