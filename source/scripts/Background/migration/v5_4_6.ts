import { reload } from 'utils/browser';
import { saveState } from 'state/localStorage';
import { SWAP_LOGO } from 'constants/index';
import { AssetType } from 'state/vault/types';

const VERSION = '5.4.6';
const PACA_SWAP_ASSET_KEY = 'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W-main2';
const PACA_SWAP_ASSET_INFO = {
  id: 'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W-main2',
  address: 'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W',
  label: 'PacaSwap',
  symbol: 'SWAP',
  decimals: 8,
  type: AssetType.Constellation,
  logo: SWAP_LOGO,
  network: 'main2',
  l0endpoint: 'http://pacaswap-mainnet-ml0-286306868.us-west-1.elb.amazonaws.com',
  l1endpoint: 'http://pacaswap-mainnet-cl1-647928315.us-west-1.elb.amazonaws.com',
  dl1endpoint: 'http://pacaswap-mainnet-dl1-1672636488.us-west-1.elb.amazonaws.com',
  priceId: 'pacaswap',
}

const MigrateRunner = async (oldState: any) => {
  try {
    const newState = {
      ...oldState,
      assets: {
        ...oldState.assets,
        [PACA_SWAP_ASSET_KEY]: PACA_SWAP_ASSET_INFO,
      },
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
