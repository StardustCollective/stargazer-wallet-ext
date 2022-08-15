import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { AVALANCHE_NETWORK, BSC_NETWORK, DAG_NETWORK, ETH_NETWORK, POLYGON_NETWORK } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring'
import { saveState } from 'state/localStorage';

type V3_7_0ActiveNetworkState = {
    assets: IAssetListState
    nfts: INFTListState,
    contacts: IContactBookState,
    dapp: {},
    price: IPriceState,
    vault: IVaultState
}

const MigrateRunner = async (oldState: any) => {
    try {
        const newState: V3_7_0ActiveNetworkState = {
            ...oldState,
            vault: {
                ...oldState.vault,
                // activeNetwork shape changed
                activeNetwork: {
                    [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
                    [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
                    'Avalanche': AVALANCHE_NETWORK['avalanche-mainnet'].id,
                    'BSC': BSC_NETWORK.bsc.id,
                    'Polygon': POLYGON_NETWORK.matic.id,
                },
                balances: {
                    [AssetType.Constellation]: '0',
                    [AssetType.Ethereum]: '0',
                    [AssetType.Avalanche]: '0',
                    [AssetType.BSC]: '0',
                    [AssetType.Polygon]: '0',
                },
                customNetworks: {
                    constellation: {},
                    ethereum: {},
                },
                version: '3.7.0',
            },

        };
        await saveState(newState);
        console.log('Migrate to <v3.7.0> successfully!');
        reload();
    } catch (error) {
        console.log('<v3.7.0> Migration Error');
        console.log(error);
    }
};

export default MigrateRunner;
