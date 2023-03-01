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

const splitObject = (object: IAssetListState, splitKey: string) => {
    const obj1: IAssetListState = {};
    const obj2: IAssetListState = {};
    let keyFound = false;

    for (const key in object) {
        if (key === splitKey) {
            obj1[key] = object[key];
            break;
        }
        obj1[key] = object[key];
    }

    for (const key in object) {
        if (key !== splitKey) {
            if (keyFound) {
                obj2[key] = object[key];
            }
        } else {
            keyFound = true;
        }
    }

    return [obj1, obj2];
};

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
    const LATTICE_KEY = '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet';
    const [assetsPart1, assetsPart2] = splitObject(oldState.assets, LATTICE_KEY);
    try {
        const newState: V3_11_0ActiveNetworkState = {
            ...oldState,
            assets: {
                ...assetsPart1,
                ...veLTXAsset,
                ...assetsPart2,
            },
            vault: {
                ...oldState.vault,
                version: '3.11.1',
            },
        };
        await saveState(newState);
        console.log('Migrate to <v3.11.1> successfully!');
        reload();
    } catch (error) {
        console.log('<v3.11.1> Migration Error');
        console.log(error);
    }
};

export default MigrateRunner;
