import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { DOR_LOGO } from 'constants/index';
import { filterObjectByKey, splitObjectByKey } from 'utils/objects';

const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
const DOR_ASSET_ADDRESS = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM';

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

const DOR_ASSET_INFO = {
  id: DOR_ASSET_KEY,
  address: DOR_ASSET_ADDRESS,
  label: 'DOR',
  symbol: 'DOR',
  decimals: 8,
  type: AssetType.Constellation,
  logo: DOR_LOGO,
  network: 'main2',
  l0endpoint: 'http://l0-lb-mainnet.getdor.com:7000',
  l1endpoint: 'http://cl1-lb-mainnet.getdor.com:8000',
};

const DORAsset = {
  [DOR_ASSET_KEY]: DOR_ASSET_INFO,
};

const MigrateRunner = async (oldState: any) => {
  const DAG_KEY = AssetType.Constellation;
  const assetsFiltered = filterObjectByKey(oldState.assets, DOR_ASSET_KEY);
  const [assetsPart1, assetsPart2] = splitObjectByKey(assetsFiltered, DAG_KEY);
  try {
    const newState: V3_11_1ActiveNetworkState = {
      ...oldState,
      assets: {
        ...assetsPart1,
        ...DORAsset,
        ...assetsPart2,
      },
      vault: {
        ...oldState.vault,
        version: '4.0.1',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v4.0.1> successfully!');
    reload();
  } catch (error) {
    console.log('<v4.0.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
