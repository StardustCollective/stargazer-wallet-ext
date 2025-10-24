import { CONSTELLATION_LOGO, DOR_LOGO } from 'constants/index';

import IAssetListState from 'state/assets/types';
import { saveState } from 'state/localStorage';
import { AssetType } from 'state/vault/types';

import { reload } from 'utils/browser';

const OLD_BASE_DOR_ID = '0xfe9885baff18074846aaa2d5541581adf068731d-base-mainnet';
const NEW_BASE_DOR_ID = '0x38a7C0416164faa29d207c9cF2273a5b80210aeD-base-mainnet';
const OLD_BASE_DAG_ID = '0x74299A718b2c44483a27325d7725F0B2646DE3B1-base-mainnet';
const NEW_BASE_DAG_ID = '0xEcFf4D80f54CF55c626E52F304a8891645961e72-base-mainnet';

const NEW_BASE_DAG_ASSET = {
  id: NEW_BASE_DAG_ID,
  address: '0xEcFf4D80f54CF55c626E52F304a8891645961e72',
  label: 'Base DAG',
  symbol: 'BASE_DAG',
  type: AssetType.ERC20,
  priceId: 'constellation-labs',
  network: 'base-mainnet',
  logo: CONSTELLATION_LOGO,
  decimals: 8,
};
const NEW_BASE_DOR_ASSET = {
  id: NEW_BASE_DOR_ID,
  address: '0x38a7C0416164faa29d207c9cF2273a5b80210aeD',
  label: 'Base DOR',
  symbol: 'BASE_DOR',
  type: AssetType.ERC20,
  priceId: 'dor',
  network: 'base-mainnet',
  logo: DOR_LOGO,
  decimals: 8,
};

const VERSION = '5.4.4';

const updateAssets = (assets: IAssetListState) => {
  const assetsUpdated = {
    ...assets,
  };

  if (assetsUpdated[OLD_BASE_DOR_ID]) {
    assetsUpdated[NEW_BASE_DOR_ID] = NEW_BASE_DOR_ASSET;
    delete assetsUpdated[OLD_BASE_DOR_ID];
  }
  if (assetsUpdated[OLD_BASE_DAG_ID]) {
    assetsUpdated[NEW_BASE_DAG_ID] = NEW_BASE_DAG_ASSET;
    delete assetsUpdated[OLD_BASE_DAG_ID];
  }

  return assetsUpdated;
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState = {
      ...oldState,
      assets: updateAssets(oldState.assets),
      vault: {
        ...oldState.vault,
        version: VERSION,
      },
    };
    await saveState(newState);
    console.log(`Migrate to <${VERSION}> successfully!`);
    reload();
  } catch (error) {
    console.log(`<${VERSION}> Migration Error`);
    console.log(error);
  }
};

export default MigrateRunner;
