import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { IBiometricsState } from 'state/biometrics/types';
import { IDAppState } from 'state/dapp/types';

type V4_0_4_State = {
  assets: IAssetListState;
  biometrics: IBiometricsState;
  contacts: IContactBookState;
  dapp: IDAppState;
  nfts: INFTListState;
  price: IPriceState;
  providers: IProvidersState;
  swap: ISwapState;
  vault: IVaultState;
};

const updateAssets = (assets: IAssetListState, assetKey: string, properties: object) => {
  const assetInfo = assets[assetKey];
  if (!assetInfo) return assets;

  const assetWithProperties = {
    ...assetInfo,
    ...properties,
  };

  const assetsUpdated = {
    ...assets,
    [assetKey]: assetWithProperties,
  };

  return assetsUpdated;
};

const MigrateRunner = async (oldState: any) => {
  const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
  const assetsUpdated = updateAssets(oldState.assets, DOR_ASSET_KEY, {
    l0endpoint: 'http://l0-lb-mainnet.getdor.com:7000',
    l1endpoint: 'http://cl1-lb-mainnet.getdor.com:8000',
  });
  try {
    const newState: V4_0_4_State = {
      ...oldState,
      assets: assetsUpdated,
      vault: {
        ...oldState.vault,
        version: '4.1.0',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v4.1.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v4.1.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
