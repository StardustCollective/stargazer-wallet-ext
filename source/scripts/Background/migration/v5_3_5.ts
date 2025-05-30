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

type V5_3_5_State = {
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
  const UP_ASSET_KEY = 'DAG7Ghth1WhWK83SB3MtXnnHYZbCsmiRTwJrgaW1-main2';
  const NDT_ASSET_KEY = 'DAG06z64ifT2HzXoHfMexRfrcnpYFEwMqjFiPKze-main2';

  const assetsUpdated = updateAssets(oldState.assets, {
    [NDT_ASSET_KEY]: {
      l0endpoint: 'http://150.136.213.232:9100',
      l1endpoint: 'http://150.136.213.232:9200',
    },
    [UP_ASSET_KEY]: {
      priceId: 'the-upsider-ai',
    },
  });

  try {
    const newState: V5_3_5_State = {
      ...oldState,
      assets: assetsUpdated,
      vault: {
        ...oldState.vault,
        version: '5.3.5',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v5.3.5> successfully!');
    reload();
  } catch (error) {
    console.log('<v5.3.5> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
