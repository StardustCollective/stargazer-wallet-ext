import { reload } from 'utils/browser';
import { AssetType } from 'state/vault/types';
import { saveState } from 'state/localStorage';
import { USDC_DAG_LOGO } from 'constants/index';
import { filterObjectByKey, splitObjectByKey } from 'utils/objects';

const USDC_ASSET_ADDRESS = 'DAG0S16WDgdAvh8VvroR6MWLdjmHYdzAF5S181xh';
const USDC_ASSET_KEY = `${USDC_ASSET_ADDRESS}-main2`;

const USDC_ASSET_INFO = {
  id: USDC_ASSET_KEY,
  address: USDC_ASSET_ADDRESS,
  label: 'USDC.dag',
  symbol: 'USDC.dag',
  decimals: 8,
  type: AssetType.Constellation,
  logo: USDC_DAG_LOGO,
  network: 'main2',
  l0endpoint: 'http://usdc-ml0-463769650.us-west-1.elb.amazonaws.com',
  l1endpoint: 'http://usdc-cl1-1109728921.us-west-1.elb.amazonaws.com',
  priceId: 'bridged-usd-coin-base',
};

const UsdcAsset = {
  [USDC_ASSET_KEY]: USDC_ASSET_INFO,
};

const VERSION = '5.4.2';

const MigrateRunner = async (oldState: any) => {
  const DAG_ASSET_KEY = 'constellation';
  const assetsFiltered = filterObjectByKey(oldState.assets, USDC_ASSET_KEY);
  const [assetsPart1, assetsPart2] = splitObjectByKey(assetsFiltered, DAG_ASSET_KEY);
  const customAssetsFiltered = oldState.vault.customAssets.filter((asset: any) => asset.id !== USDC_ASSET_KEY);
  try {
    const newState = {
      ...oldState,
      assets: {
        ...assetsPart1,
        ...UsdcAsset,
        ...assetsPart2,
      },
      vault: {
        ...oldState.vault,
        customAssets: customAssetsFiltered,
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
