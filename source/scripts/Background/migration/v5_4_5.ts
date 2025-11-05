import { reload } from 'utils/browser';
import { AssetSymbol, AssetType, Network } from 'state/vault/types';
import { saveState } from 'state/localStorage';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO, INK_NETWORK } from 'constants/index';

const VERSION = '5.4.5';

const inkAsset = {
  id: AssetType.Ink,
  address: '',
  label: 'Ink ETH',
  symbol: AssetSymbol.INK,
  type: AssetType.Ethereum,
  priceId: 'ethereum',
  network: 'ink-mainnet',
  logo: ETHEREUM_LOGO,
  decimals: 18,
};

const dagInkAsset = {
  '0x1467d31ab00F986d0e0e764365d999972289CD03-ink-mainnet': {
    id: '0x1467d31ab00F986d0e0e764365d999972289CD03-ink-mainnet',
    address: '0x1467d31ab00F986d0e0e764365d999972289CD03',
    label: 'Ink DAG',
    symbol: 'INK_DAG',
    type: AssetType.ERC20,
    priceId: 'constellation-labs',
    network: 'ink-mainnet',
    logo: CONSTELLATION_LOGO,
    decimals: 8,
  },
}

const MigrateRunner = async (oldState: any) => {
  try {
    const newState = {
      ...oldState,
      assets: {
        ...oldState.assets,
        [AssetType.Ink]: inkAsset,
        ...dagInkAsset,
      },
      vault: {
        ...oldState.vault,
        activeNetwork: {
          ...oldState.vault.activeNetwork,
          [Network.Ink]: INK_NETWORK[`ink-mainnet`].id,
        },
        balances: {
          ...oldState.vault.balances,
          [AssetType.Ink]: '0',
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
