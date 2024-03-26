import { reload } from 'utils/browser';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { IBiometricsState } from 'state/biometrics/types';
import { IDAppState } from 'state/dapp/types';
import {
  AVALANCHE_DEFAULT_LOGO,
  AVALANCHE_LOGO,
  BSC_DEFAULT_LOGO,
  BSC_LOGO,
  CONSTELLATION_DEFAULT_LOGO,
  CONSTELLATION_LOGO,
  DOR_LOGO,
  ETHEREUM_DEFAULT_LOGO,
  ETHEREUM_LOGO,
  JENNYCO_LOGO,
  LATTICE_LOGO,
  POLYGON_DEFAULT_LOGO,
  POLYGON_LOGO,
  VE_LTX_LOGO,
} from 'constants/index';

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

const BASE_URL = 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos';

const DEFAULT_LOGOS_MAP = {
  [`${BASE_URL}/constellation-default-logo.png`]: CONSTELLATION_DEFAULT_LOGO,
  [`${BASE_URL}/ethereum-default-logo.png`]: ETHEREUM_DEFAULT_LOGO,
  [`${BASE_URL}/avalanche-default-logo.png`]: AVALANCHE_DEFAULT_LOGO,
  [`${BASE_URL}/bsc-logo.png`]: BSC_DEFAULT_LOGO,
  [`${BASE_URL}/polygon-default-logo.png`]: POLYGON_DEFAULT_LOGO,
};

function isDefaultLogo(logo: string) {
  return Object.keys(DEFAULT_LOGOS_MAP).includes(logo);
}

function updateCustomAssets(assets: IAssetListState) {
  // Create a copy of the assets to avoid modifying the original object
  const updatedAssets: any = { ...assets };

  Object.keys(assets).forEach((key) => {
    const assetInfo = updatedAssets[key];
    const isCustom = assetInfo.custom;
    const hasDefaultLogo = isDefaultLogo(assetInfo.logo);
    if (isCustom && hasDefaultLogo) {
      const newDefaultLogo =
        DEFAULT_LOGOS_MAP[assetInfo.logo as keyof typeof DEFAULT_LOGOS_MAP];
      updatedAssets[key] = { ...updatedAssets[key], logo: newDefaultLogo };
    }
  });

  return updatedAssets;
}

function updateCustomAssetsArray(customAssets: IAssetInfoState[]) {
  // Create a copy of the assets to avoid modifying the original object
  const updatedCustomAssets: IAssetInfoState[] = [...customAssets];

  updatedCustomAssets.forEach((customAsset, index) => {
    const hasDefaultLogo = isDefaultLogo(customAsset.logo);
    if (hasDefaultLogo) {
      const newDefaultLogo =
        DEFAULT_LOGOS_MAP[customAsset.logo as keyof typeof DEFAULT_LOGOS_MAP];
      updatedCustomAssets[index] = { ...customAsset, logo: newDefaultLogo };
    }
  });

  return updatedCustomAssets;
}

const MigrateRunner = async (oldState: any) => {
  const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
  const LTX_ASSET_KEY = '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet';
  const VELTX_ASSET_KEY = '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet';
  const JENNYCO_ASSET_KEY = '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic';
  const NEW_L0_ENDPOINT = 'http://l0-lb-mainnet.getdor.com:7000';
  const NEW_L1_ENDPOINT = 'http://cl1-lb-mainnet.getdor.com:8000';

  const customAssetArrayUpdate = updateCustomAssetsArray(oldState.vault.customAssets);
  const assetsUpdated = updateAssets(oldState.assets, {
    [AssetType.Constellation]: {
      logo: CONSTELLATION_LOGO,
    },
    [AssetType.Ethereum]: {
      logo: ETHEREUM_LOGO,
    },
    [DOR_ASSET_KEY]: {
      l0endpoint: NEW_L0_ENDPOINT,
      l1endpoint: NEW_L1_ENDPOINT,
      logo: DOR_LOGO,
    },
    [AssetType.Avalanche]: {
      logo: AVALANCHE_LOGO,
    },
    [AssetType.Polygon]: {
      logo: POLYGON_LOGO,
    },
    [AssetType.BSC]: {
      logo: BSC_LOGO,
    },
    [LTX_ASSET_KEY]: {
      logo: LATTICE_LOGO,
    },
    [VELTX_ASSET_KEY]: {
      logo: VE_LTX_LOGO,
    },
    [JENNYCO_ASSET_KEY]: {
      logo: JENNYCO_LOGO,
    },
  });
  const customAssetsUpdated = updateCustomAssets(assetsUpdated);

  try {
    const newState: V4_0_4_State = {
      ...oldState,
      assets: customAssetsUpdated,
      vault: {
        ...oldState.vault,
        customAssets: customAssetArrayUpdate,
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
