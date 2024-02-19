import { reload } from 'utils/browser';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { DAG_NETWORK, ETH_NETWORK, POLYGON_LOGO, POLYGON_NETWORK } from 'constants/index';
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

const polygonAsset = {
  id: AssetType.Polygon,
  address: '',
  label: 'Polygon',
  symbol: 'MATIC',
  type: AssetType.Ethereum,
  priceId: 'matic-network',
  network: 'matic',
  logo: POLYGON_LOGO,
  decimals: 18,
};

const generateERC20assets = (assets: IAssetListState) => {
  let newAssets: IAssetListState = {};
  for (const assetId in assets) {
    const assetInfo = assets[assetId];
    if (assetInfo.type === AssetType.ERC20) {
      const newId = `${assetId}-${assetInfo.network}`;
      newAssets[newId] = {
        ...assetInfo,
        id: newId,
      };
    } else {
      newAssets[assetId] = assetInfo;
    }
  }
  newAssets[AssetType.Polygon] = polygonAsset;
  return newAssets;
};

const generateCustomTokens = (assets: IAssetListState) => {
  let newCustomAssets: IAssetInfoState[] = [];
  for (const assetId in assets) {
    const assetInfo = assets[assetId];
    if (!!assetInfo?.custom) {
      const newId = `${assetId}-${assetInfo.network}`;
      const customAsset = {
        ...assetInfo,
        id: newId,
      };
      newCustomAssets.push(customAsset);
    }
  }
  return newCustomAssets;
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V3_8_0ActiveNetworkState = {
      ...oldState,
      assets: generateERC20assets(oldState.assets),
      vault: {
        ...oldState.vault,
        // activeNetwork shape changed
        activeNetwork: {
          [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
          [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
          Polygon: POLYGON_NETWORK.matic.id,
        },
        balances: {
          [AssetType.Constellation]: '0',
          [AssetType.Ethereum]: '0',
          [AssetType.Polygon]: '0',
        },
        customNetworks: {
          constellation: {},
          ethereum: {},
        },
        customAssets: generateCustomTokens(oldState.assets),
        version: '3.8.0',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.8.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.8.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
