import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IVaultState from 'state/vault/types';
import { IBiometricsState } from 'state/biometrics/types';
import { IDAppInfo, IDAppState } from 'state/dapp/types';
import storageApi from 'utils/localStorage';
import { compareVersions } from 'utils/version';
import { isNative } from 'utils/envUtil';
import { STARGAZER_LOGO } from 'constants/index';

type V5_0_0_State = {
  vault: IVaultState;
  contacts: IContactBookState;
  assets: IAssetListState;
  dapp: IDAppState;
  swap: {
    txIds: string[];
  };
  biometrics: IBiometricsState;
};
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

const migrateDappLogos = (oldDappState: IDAppState) => {
  const updatedWhitelist: {
    [dappId: string]: IDAppInfo;
  } = {};
  const oldWhitelist = oldDappState?.whitelist ?? {};

  for (const origin in oldWhitelist) {
    updatedWhitelist[origin] = {
      ...oldWhitelist[origin],
      logo: STARGAZER_LOGO,
    };
  }

  return {
    ...oldDappState,
    whitelist: updatedWhitelist,
  };
};

const migrateState = async () => {
  try {
    const oldState = await _global.localStorage.getItem(STATE_KEY);
    if (!oldState) return;
    const state = JSON.parse(oldState);
    const newDappState = migrateDappLogos(state.dapp);
    const newState: V5_0_0_State = {
      vault: {
        ...state.vault,
        version: '5.0.0',
      },
      contacts: state.contacts,
      assets: state.assets,
      dapp: newDappState,
      swap: {
        txIds: state.swap.txIds,
      },
      biometrics: state.biometrics,
    };
    const serializedState = JSON.stringify(newState);
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
  await migrateEncryptedVault();
  await migratePendingTransactions();
  reload();
};

export default MigrateRunner;
