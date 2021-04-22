import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import {
  setKeystoreInfo,
  deleteWallet as deleteWalletState,
  changeAccountActiveId,
  changeActiveNetwork,
  updateStatus,
  removeSeedAccounts,
} from 'state/wallet';
import AccountController, { IAccountController } from './AccountController';
import { DAG_NETWORK, ETH_PREFIX } from 'constants/index';
import IWalletState, {
  AccountType,
  AssetType,
  NetworkType,
  SeedKeystore,
} from 'state/wallet/types';
import IAssetListState from 'state/assets/types';
import { browser } from 'webextension-polyfill-ts';

export interface IWalletController {
  account: Readonly<IAccountController>;
  createWallet: (isUpdated?: boolean, primary?: string) => void;
  deleteWallet: (pwd: string) => void;
  switchWallet: (id: string) => Promise<void>;
  switchNetwork: (assetId: string, networkId: string) => void;
  generatedPhrase: (update?: boolean) => string | null;
  setWalletPassword: (pwd: string) => void;
  importPhrase: (phr: string) => boolean;
  isLocked: () => boolean;
  unLock: (pwd: string) => Promise<boolean>;
  checkPassword: (pwd: string) => boolean;
  getPhrase: (id: string, pwd: string) => Promise<string | null>;
  logOut: () => void;
}

const WalletController = (): IWalletController => {
  let password = '';
  let phrase = '';

  const importPrivKey = async (privKey: string, networkType: NetworkType) => {
    const { keystores }: IWalletState = store.getState().wallet;
    if (isLocked() || !privKey) return null;
    const v3Keystore = await dag4.keyStore.generateEncryptedPrivateKey(
      password,
      privKey
    );
    if (
      Object.keys(keystores).filter(
        (id) =>
          (keystores[id] as any).address === (v3Keystore as any).address &&
          ((id.startsWith(ETH_PREFIX) &&
            networkType === NetworkType.Ethereum) ||
            (!id.startsWith(ETH_PREFIX) &&
              networkType === NetworkType.Constellation))
      ).length
    ) {
      return null;
    }
    store.dispatch(setKeystoreInfo({ keystore: v3Keystore, networkType }));
    return v3Keystore;
  };

  const checkPassword = (pwd: string) => {
    return password === pwd;
  };

  const account = Object.freeze(
    AccountController({
      getMasterKey: async (id: string) => {
        const { keystores }: IWalletState = store.getState().wallet;
        const phrase = await dag4.keyStore.decryptPhrase(
          keystores[id] as SeedKeystore,
          password
        );
        return dag4.keyStore.getMasterKeyFromMnemonic(phrase);
      },
      checkPassword,
      importPrivKey,
    })
  );

  const generatedPhrase = (update = false) => {
    if (update) {
      phrase = dag4.keyStore.generateSeedPhrase();
      return phrase;
    }
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

  const getPhrase = async (id: string, pwd: string) => {
    if (!checkPassword(pwd)) return null;
    if (!seedWalletKeystore()) return null;
    const { keystores }: IWalletState = store.getState().wallet;
    const phrase = await dag4.keyStore.decryptPhrase(
      keystores[id] as SeedKeystore,
      pwd
    );
    return phrase;
  };

  const unLock = async (pwd: string): Promise<boolean> => {
    const keystore = seedWalletKeystore();
    if (!keystore) return false;

    try {
      phrase = await dag4.keyStore.decryptPhrase(keystore as SeedKeystore, pwd);
      password = pwd;
      await account.getPrimaryAccount(password);
      account.watchMemPool();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createWallet = async (
    isUpdated = false,
    primaryAccLabel = 'Account 1'
  ) => {
    if (isUpdated) {
      if (seedWalletKeystore()) {
        store.dispatch(removeSeedAccounts());
      }
    }
    const v3Keystore = await dag4.keyStore.encryptPhrase(phrase, password);
    store.dispatch(
      setKeystoreInfo({
        keystore: v3Keystore,
        networkType: NetworkType.MultiChain,
      })
    );
    await account.subscribeAccount(v3Keystore.id, primaryAccLabel);
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
    const { accounts, keystores }: IWalletState = store.getState().wallet;

    if (!accounts) return null;
    const seedAccounts = Object.values(accounts).filter(
      (account) => account.type === AccountType.Seed
    );

    return seedAccounts.length ? keystores[seedAccounts[0].id] : null;
  };

  const logOut = async () => {
    password = '';
    phrase = '';
    store.dispatch(updateStatus());
    browser.runtime.reload();
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
