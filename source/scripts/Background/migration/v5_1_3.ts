import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import { saveState } from 'state/localStorage';
import { IBiometricsState } from 'state/biometrics/types';
import { IDAppState } from 'state/dapp/types';

type V5_1_3_State = {
  vault: IVaultState;
  price: IPriceState;
  contacts: IContactBookState;
  assets: IAssetListState;
  dapp: IDAppState;
  swap: {
    txIds: string[];
  };
  biometrics: IBiometricsState;
};

const VERSION = '5.1.3';

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
  const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
  const PACA_ASSET_KEY = 'DAG7ChnhUF7uKgn8tXy45aj4zn9AFuhaZr8VXY43-main2';
  const DOR_dL1_ENDPOINT = 'http://dl1-lb-mainnet.getdor.com:9000';
  const PACA_dL1_ENDPOINT =
    'http://elpaca-dl1-550039959.us-west-1.elb.amazonaws.com:9300';

  const assetsUpdated = updateAssets(oldState.assets, {
    [DOR_ASSET_KEY]: {
      dl1endpoint: DOR_dL1_ENDPOINT,
    },
    [PACA_ASSET_KEY]: {
      dl1endpoint: PACA_dL1_ENDPOINT,
    },
  });

  try {
    const newState: V5_1_3_State = {
      ...oldState,
      assets: assetsUpdated,
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
