import { dag4 } from '@stardust-collective/dag4';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import {
  setKeystoreInfo,
  deleteWallet as deleteWalletState,
  changeAccountActiveId,
  changeActiveNetwork,
  updateStatus,
  updateSeedKeystoreId,
  removeSeedAccounts,
} from 'state/wallet';
import AccountController, { IAccountController } from './AccountController';
import { DAG_NETWORK } from 'constants/index';
import IWalletState, { AssetType, SeedKeystore } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';

export interface IWalletController {
  account: Readonly<IAccountController>;
  createWallet: (isUpdated?: boolean) => void;
  deleteWallet: (pwd: string) => void;
  switchWallet: (id: string) => Promise<void>;
  switchNetwork: (assetId: string, networkId: string) => void;
  generatedPhrase: () => string | null;
  setWalletPassword: (pwd: string) => void;
  importPhrase: (phr: string) => boolean;
  isLocked: () => boolean;
  unLock: (pwd: string) => Promise<boolean>;
  checkPassword: (pwd: string) => boolean;
  getPhrase: (pwd: string) => string | null;
  logOut: () => void;
}

const WalletController = (): IWalletController => {
  let password = '';
  let phrase = '';
  let masterKey: hdkey;

  const importPrivKey = async (privKey: string) => {
    const { keystores }: IWalletState = store.getState().wallet;
    if (isLocked() || !privKey) return null;
    const v3Keystore = await dag4.keyStore.generateEncryptedPrivateKey(
      password,
      privKey
    );
    if (
      Object.values(keystores).filter(
        (keystore) => (keystore as any).address === (v3Keystore as any).address
      ).length
    )
      return null;
    store.dispatch(setKeystoreInfo(v3Keystore));
    return v3Keystore;
  };

  const checkPassword = (pwd: string) => {
    return password === pwd;
  };

  const account = Object.freeze(
    AccountController({
      getMasterKey: () => {
        return seedWalletKeystore() ? masterKey : null;
      },
      checkPassword,
      importPrivKey,
    })
  );

  const generatedPhrase = () => {
    if (seedWalletKeystore()) return null;
    if (!phrase) phrase = dag4.keyStore.generateSeedPhrase();
    return phrase;
  };

  const importPhrase = (phr: string) => {
    try {
      if (dag4.keyStore.getMasterKeyFromMnemonic(phr)) {
        phrase = phr;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const isLocked = () => {
    return !password || !phrase;
  };

  const getPhrase = (pwd: string) => {
    return checkPassword(pwd) ? phrase : null;
  };

  const unLock = async (pwd: string): Promise<boolean> => {
    const keystore = seedWalletKeystore();
    if (!keystore) return false;

    try {
      phrase = await dag4.keyStore.decryptPhrase(keystore as SeedKeystore, pwd);
      password = pwd;
      masterKey = dag4.keyStore.getMasterKeyFromMnemonic(phrase);
      await account.getPrimaryAccount(password);
      account.watchMemPool();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createWallet = async (isUpdated = false) => {
    if (!isUpdated && seedWalletKeystore()) return;
    if (isUpdated) {
      const { seedKeystoreId, keystores } = store.getState().wallet;
      if (seedKeystoreId && keystores[seedKeystoreId]) {
        store.dispatch(removeSeedAccounts());
      }
    }
    const v3Keystore = await dag4.keyStore.encryptPhrase(phrase, password);
    masterKey = dag4.keyStore.getMasterKeyFromMnemonic(phrase);
    store.dispatch(setKeystoreInfo(v3Keystore));
    store.dispatch(updateSeedKeystoreId(v3Keystore.id));
    await account.subscribeAccount(0);
    await account.getPrimaryAccount(password);
    if (isUpdated) {
      account.getLatestUpdate();
    }
  };

  const deleteWallet = (pwd: string) => {
    if (checkPassword(pwd)) {
      password = '';
      phrase = '';
      store.dispatch(deleteWalletState());
      store.dispatch(updateStatus());
    }
  };

  const switchWallet = async (id: string) => {
    store.dispatch(changeAccountActiveId(id));
    await account.getLatestUpdate();
    dag4.monitor.startMonitor();
  };

  const switchNetwork = (assetId: string, networkId: string) => {
    const { accounts, activeAccountId }: IWalletState = store.getState().wallet;
    const assets: IAssetListState = store.getState().assets;
    const activeAccount = accounts[activeAccountId];

    if (assetId === AssetType.Constellation && DAG_NETWORK[networkId]!.id) {
      dag4.network.setNetwork({
        id: DAG_NETWORK[networkId].id,
        beUrl: DAG_NETWORK[networkId].beUrl,
        lbUrl: DAG_NETWORK[networkId].lbUrl,
      });
    }

    if (assets[activeAccount.activeAssetId].network !== networkId) {
      account.updateAccountActiveAsset(
        activeAccountId,
        AssetType.Constellation
      );
    }

    store.dispatch(
      changeActiveNetwork({
        asset: assetId,
        network: networkId,
      })
    );
    account.getLatestUpdate();
  };

  const setWalletPassword = (pwd: string) => {
    password = pwd;
  };

  const seedWalletKeystore = () => {
    const { keystores, seedKeystoreId }: IWalletState = store.getState().wallet;
    return keystores && seedKeystoreId && keystores[seedKeystoreId]
      ? keystores[seedKeystoreId]
      : null;
  };

  const logOut = () => {
    password = '';
    phrase = '';
    store.dispatch(updateStatus());
  };

  return {
    account,
    importPhrase,
    generatedPhrase,
    setWalletPassword,
    createWallet,
    isLocked,
    unLock,
    checkPassword,
    getPhrase,
    deleteWallet,
    switchWallet,
    switchNetwork,
    logOut,
  };
};

export default WalletController;
