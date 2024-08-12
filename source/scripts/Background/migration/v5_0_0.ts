import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IVaultState from 'state/vault/types';
import { IBiometricsState } from 'state/biometrics/types';
import { IDAppState } from 'state/dapp/types';
import storageApi from 'utils/localStorage';
import { compareVersions } from 'utils/version';
import { isNative } from 'utils/envUtil';
import { STARGAZER_LOGO } from 'constants/index';
import { EthChainId, PolygonChainId } from '../controllers/EVMChainController/types';
import IPriceState from 'state/price/types';

type V5_0_0_State = {
  vault: IVaultState;
  price: IPriceState;
  contacts: IContactBookState;
  assets: IAssetListState;
  dapp: IDAppState;
  swap: {
    txIds: string[];
  };
  biometrics: IBiometricsState;
};
export interface OldIDAppInfo {
  origin: string;
  logo: string;
  title: string;
  accounts?: IDappAccounts;
}
export interface IDappAccounts {
  ethereum?: string[];
  constellation?: string[];
}

const STATE_KEY = 'state';

const _global = !!globalThis ? globalThis : global;

export const checkStorageMigration = async () => {
  const oldState = await _global.localStorage.getItem(STATE_KEY);
  if (!isNative && !!oldState) {
    const state = JSON.parse(oldState);
    if (!!state?.vault?.version && compareVersions(state.vault.version, '5.0.0') < 0) {
      await MigrateRunner();
    }
  }
};

const migrateDapp = (oldState: V5_0_0_State) => {
  const updatedWhitelist: {
    [dappId: string]: OldIDAppInfo;
  } = {};
  const oldWhitelist = oldState?.dapp?.whitelist ?? {};

  for (const origin in oldWhitelist) {
    updatedWhitelist[origin] = {
      ...oldWhitelist[origin],
      logo: STARGAZER_LOGO,
    };

    delete updatedWhitelist[origin]?.accounts;
  }

  return {
    ...oldState.dapp,
    whitelist: updatedWhitelist,
  };
};

const migrateActiveNetwork = (oldState: V5_0_0_State) => {
  const ethNetworkUpdated =
    oldState?.vault?.activeNetwork?.Ethereum === ('goerli' as EthChainId)
      ? 'sepolia'
      : oldState?.vault?.activeNetwork?.Ethereum;
  const polygonNetworkUpdated =
    oldState?.vault?.activeNetwork?.Polygon === ('maticmum' as PolygonChainId)
      ? 'amoy'
      : oldState?.vault?.activeNetwork?.Polygon;

  return {
    ...oldState.vault.activeNetwork,
    Ethereum: ethNetworkUpdated,
    Polygon: polygonNetworkUpdated,
  };
};

const migrateCurrentEVMNetwork = (oldState: V5_0_0_State) => {
  const currentValue = oldState?.vault?.currentEVMNetwork;
  return currentValue === 'goerli'
    ? 'sepolia'
    : currentValue === 'maticmum'
    ? 'amoy'
    : currentValue;
};

const migrateCustomAssets = (oldState: V5_0_0_State) => {
  const oldCustomAssets = oldState?.vault?.customAssets ?? [];
  const oldNetorks = ['maticmum', 'goerli'];

  return oldCustomAssets?.filter(
    (item) => item?.custom && !oldNetorks.includes(item.network)
  );
};
const migrateAssets = (oldState: V5_0_0_State) => {
  const assetsUpdated: IAssetListState = {};
  const oldAssets = oldState?.assets ?? {};
  const oldNetorks = ['maticmum', 'goerli'];

  for (const key in oldAssets) {
    const custom = oldAssets[key].custom;
    const network = oldAssets[key].network;

    if (custom && oldNetorks.includes(network)) continue;

    assetsUpdated[key] = oldAssets[key];
  }

  return assetsUpdated;
};

const migrateState = async () => {
  try {
    const oldState = await _global.localStorage.getItem(STATE_KEY);
    if (!oldState) return;
    const state: V5_0_0_State = JSON.parse(oldState);

    const newState: V5_0_0_State = {
      vault: {
        ...state.vault,
        activeNetwork: migrateActiveNetwork(state),
        currentEVMNetwork: migrateCurrentEVMNetwork(state),
        customAssets: migrateCustomAssets(state),
        version: '5.0.0',
      },
      price: state.price,
      contacts: state.contacts,
      assets: migrateAssets(state),
      dapp: migrateDapp(state),
      swap: {
        txIds: state.swap.txIds,
      },
      biometrics: state.biometrics,
    };

    const serializedState = JSON.stringify(newState);

    if (isNative) {
      // Update localStorage in Mobile
      await _global.localStorage.setItem(STATE_KEY, serializedState);
      return;
    }

    // Migrate local storage to Storage API only in Chrome
    await storageApi.setItem(STATE_KEY, serializedState);
    await _global.localStorage.removeItem(STATE_KEY);
    console.log(`<v5.0.0> Migration Success: ${STATE_KEY}`);
  } catch (error) {
    console.log(`<v5.0.0> Migration Error: ${STATE_KEY}`);
    console.log(error);
  }
};

const migrateEncryptedVault = async () => {
  const ENCRYPTED_VAULT_KEY = 'stargazer-vault';
  try {
    const oldVault = await _global.localStorage.getItem(ENCRYPTED_VAULT_KEY);
    if (!oldVault) return;
    await storageApi.setItem(ENCRYPTED_VAULT_KEY, oldVault);
    await _global.localStorage.removeItem(ENCRYPTED_VAULT_KEY);
    console.log(`<v5.0.0> Migration Success: ${ENCRYPTED_VAULT_KEY}`);
  } catch (error) {
    console.log(`<v5.0.0> Migration Error: ${ENCRYPTED_VAULT_KEY}`);
    console.log(error);
  }
};

const migratePendingTransactions = async () => {
  const ETH_PENDING_KEY = 'ETH_PENDING';
  try {
    const oldPendingTx = await _global.localStorage.getItem(ETH_PENDING_KEY);
    if (!oldPendingTx) return;
    await storageApi.setItem(ETH_PENDING_KEY, oldPendingTx);
    await _global.localStorage.removeItem(ETH_PENDING_KEY);
    console.log(`<v5.0.0> Migration Success: ${ETH_PENDING_KEY}`);
  } catch (error) {
    console.log(`<v5.0.0> Migration Error: ${ETH_PENDING_KEY}`);
    console.log(error);
  }
};

const MigrateRunner = async () => {
  await migrateState();
  if (!isNative) {
    await migrateEncryptedVault();
    await migratePendingTransactions();
    reload();
  }
};

export default MigrateRunner;
