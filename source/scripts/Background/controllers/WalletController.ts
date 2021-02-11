import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import {
  setKeystoreInfo,
  deleteWallet as deleteWalletState,
  changeActiveIndex,
  changeActiveNetwork,
  updateStatus,
} from 'state/wallet';
import AccountController, { IAccountController } from './AccountController';
import { DAG_NETWORK } from 'constants/index';

export interface IWalletController {
  account: Readonly<IAccountController>;
  createWallet: (isUpdated?: boolean) => void;
  deleteWallet: (pwd: string) => void;
  switchWallet: (index: number) => Promise<void>;
  switchNetwork: (networkId: string) => void;
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

  const checkPassword = (pwd: string) => {
    return password === pwd;
  };

  const account = Object.freeze(
    AccountController({
      getMasterKey: () => {
        return walletKeystore() ? masterKey : null;
      },
      checkPassword,
    })
  );

  const generatedPhrase = () => {
    const { keystore } = store.getState().wallet;
    if (!keystore && !phrase) {
      phrase = dag.keyStore.generateSeedPhrase();
    }
    return keystore ? null : phrase;
  };

  const importPhrase = (phr: string) => {
    try {
      if (dag.keyStore.getMasterKeyFromMnemonic(phr)) {
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
    const keystore = walletKeystore();
    if (!keystore) return false;

    try {
      phrase = await dag.keyStore.decryptPhrase(keystore, pwd);
      password = pwd;
      masterKey = dag.keyStore.getMasterKeyFromMnemonic(phrase);
      await account.getPrimaryAccount();
      account.watchMemPool();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createWallet = async (isUpdated = false) => {
    if (!isUpdated && walletKeystore()) return;
    if (isUpdated) {
      store.dispatch(deleteWalletState());
    }
    const v3Keystore = await dag.keyStore.encryptPhrase(phrase, password);
    masterKey = dag.keyStore.getMasterKeyFromMnemonic(phrase);
    store.dispatch(setKeystoreInfo(v3Keystore));
    await account.subscribeAccount(0);
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

  const switchWallet = async (index: number) => {
    store.dispatch(changeActiveIndex(index));
    await account.getLatestUpdate();
  };

  const switchNetwork = (networkId: string) => {
    if (DAG_NETWORK[networkId]!.id) {
      dag.network.setNetwork({
        id: DAG_NETWORK[networkId].id,
        beUrl: DAG_NETWORK[networkId].beUrl,
        lbUrl: DAG_NETWORK[networkId].lbUrl,
      });
      store.dispatch(changeActiveNetwork(DAG_NETWORK[networkId]!.id));
      account.getLatestUpdate();
    }
  };

  const setWalletPassword = (pwd: string) => {
    password = pwd;
  };

  const walletKeystore = () => {
    const { keystore } = store.getState().wallet;
    return keystore ? keystore : null;
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
