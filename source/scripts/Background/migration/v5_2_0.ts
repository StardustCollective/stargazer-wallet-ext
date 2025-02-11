import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetSymbol, AssetType, Network } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { IUserState } from 'state/user/types';
import { BASE_LOGO, BASE_NETWORK } from 'constants/index';

type V5_2_0State = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  user: IUserState;
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
  label: 'Base',
  symbol: AssetSymbol.BASE,
  type: AssetType.Ethereum,
  priceId: 'ethereum',
  network: 'base-mainnet',
  logo: BASE_LOGO,
  decimals: 18,
};

const MigrateRunner = async (oldState: any) => {
  try {
    const newState: V5_2_0State = {
      ...oldState,
      assets: {
        ...oldState.assets,
        [AssetType.Base]: baseAsset,
      },
      vault: {
        ...oldState.vault,
        // activeNetwork shape changed
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
