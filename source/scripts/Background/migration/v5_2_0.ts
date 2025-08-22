import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetSymbol, AssetType, Network } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { BASE_NETWORK, ETHEREUM_LOGO } from 'constants/index';

type V5_2_0State = {
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

const VERSION = '5.2.0';

const baseAsset = {
  id: AssetType.Base,
  address: '',
  label: 'Base ETH',
  symbol: AssetSymbol.BASE,
  type: AssetType.Ethereum,
  priceId: 'ethereum',
  network: 'base-mainnet',
  logo: ETHEREUM_LOGO,
  decimals: 18,
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
    [AssetType.Constellation]: {
      label: 'DAG',
    },
    [AssetType.Ethereum]: {
      label: 'ETH',
    },
    [AssetType.Avalanche]: {
      label: 'AVAX',
    },
    [AssetType.Polygon]: {
      label: 'POL',
      symbol: AssetSymbol.POL,
    },
  });
  try {
    const newState: V5_2_0State = {
      ...oldState,
      assets: {
        ...assetsUpdated,
        [AssetType.Base]: baseAsset,
      },
      vault: {
        ...oldState.vault,
        activeNetwork: {
          ...oldState.vault.activeNetwork,
          [Network.Base]: BASE_NETWORK[`base-mainnet`].id,
        },
        balances: {
          ...oldState.vault.balances,
          [AssetType.Base]: '0',
        },
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
