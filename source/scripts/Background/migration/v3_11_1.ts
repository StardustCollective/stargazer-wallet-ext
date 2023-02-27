import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import ISwapState from 'state/swap/types';
import IProvidersState from 'state/providers/types';
import { INFTListState } from 'state/nfts/types';
import { saveState } from 'state/localStorage';
import { VE_LTX_LOGO } from 'constants/index';

type V3_11_0ActiveNetworkState = {
    assets: IAssetListState
    nfts: INFTListState,
    contacts: IContactBookState,
    dapp: {},
    price: IPriceState,
    providers: IProvidersState,
    vault: IVaultState,
    swap: ISwapState,
}

const veLTXAsset = {
    '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet': {
        id: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet',
        address: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349',
        label: 'Lattice Governance',
        symbol: 'veLTX',
        type: AssetType.ERC20,
        priceId: 'lattice-governance',
        network: 'mainnet',
        logo: VE_LTX_LOGO,
        decimals: 18,
    },
};

const MigrateRunner = async (oldState: any) => {
    console.log('state antes', oldState);
    try {
        const newState: V3_11_0ActiveNetworkState = {
            ...oldState,
            assets: {
                ...oldState.assets,
                ...veLTXAsset,
            },
            vault: {
                ...oldState.vault,
                version: '3.11.1',
            },
        };
        console.log('state despues', newState);
        await saveState(newState);
        console.log('Migrate to <v3.11.1> successfully!');
        reload();
    } catch (error) {
        console.log('<v3.11.1> Migration Error');
        console.log(error);
    }
};

export default MigrateRunner;
