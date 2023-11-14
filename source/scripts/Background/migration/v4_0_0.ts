import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { JENNYCO_LOGO } from 'constants/index';
import { filterArrayByValue, filterObjectByKey, splitObjectByKey } from 'utils/objects';

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

const jennyCOAsset = {
  '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic': {
    id: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic',
    address: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6',
    label: 'JennyCo',
    symbol: 'JCO',
    type: AssetType.ERC20,
    priceId: 'jennyco',
    network: 'matic',
    logo: JENNYCO_LOGO,
    decimals: 18,
  },
};

const MigrateRunner = async (oldState: any) => {
  const VE_LTX_KEY = '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet';
  const JENNY_CO_KEY = '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic';
  const assetsFiltered = filterObjectByKey(oldState.assets, JENNY_CO_KEY);
  const customAssetsFiltered = filterArrayByValue(
    oldState.vault.customAssets,
    'id',
    JENNY_CO_KEY
  );
  const [assetsPart1, assetsPart2] = splitObjectByKey(assetsFiltered, VE_LTX_KEY);
  try {
    const newState: V3_11_1ActiveNetworkState = {
      ...oldState,
      assets: {
        ...assetsPart1,
        ...jennyCOAsset,
        ...assetsPart2,
      },
      vault: {
        ...oldState.vault,
        customAssets: customAssetsFiltered,
        version: '4.0.0',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v4.0.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v4.0.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
