import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { ELPACA_LOGO } from 'constants/index';
import { filterObjectByKey, splitObjectByKey } from 'utils/objects';

const ELPACA_ASSET_ADDRESS = 'DAG7ChnhUF7uKgn8tXy45aj4zn9AFuhaZr8VXY43';
const ELPACA_ASSET_KEY = `${ELPACA_ASSET_ADDRESS}-main2`;

type V4_1_1State = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  providers: IProvidersState;
  vault: IVaultState;
  swap: ISwapState;
};

const ELPACA_ASSET_INFO = {
  id: ELPACA_ASSET_KEY,
  address: ELPACA_ASSET_ADDRESS,
  label: 'Elpaca',
  symbol: 'PACA',
  decimals: 8,
  type: AssetType.Constellation,
  logo: ELPACA_LOGO,
  network: 'main2',
  l0endpoint: 'http://elpaca-l0-2006678808.us-west-1.elb.amazonaws.com:9100',
  l1endpoint: 'http://elpaca-cl1-1512652691.us-west-1.elb.amazonaws.com:9200',
};

const ElpacaAsset = {
  [ELPACA_ASSET_KEY]: ELPACA_ASSET_INFO,
};

const MigrateRunner = async (oldState: any) => {
  const DOR_ASSET_KEY = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2';
  const assetsFiltered = filterObjectByKey(oldState.assets, ELPACA_ASSET_KEY);
  const [assetsPart1, assetsPart2] = splitObjectByKey(assetsFiltered, DOR_ASSET_KEY);
  try {
    const newState: V4_1_1State = {
      ...oldState,
      assets: {
        ...assetsPart1,
        ...ElpacaAsset,
        ...assetsPart2,
      },
      vault: {
        ...oldState.vault,
        version: '4.1.2',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v4.1.2> successfully!');
    reload();
  } catch (error) {
    console.log('<v4.1.2> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
