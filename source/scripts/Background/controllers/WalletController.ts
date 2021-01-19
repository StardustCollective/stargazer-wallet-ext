import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import { setKeystoreInfo } from 'state/wallet';
import AccountController, { IAccountController } from './AccountController';
export interface IWalletController {
  account: Readonly<IAccountController>;
  createWallet: () => void;
  generatedPhrase: () => string | null;
  setWalletPassword: (pwd: string) => void;
  isLocked: () => boolean;
  unLock: (pwd: string) => Promise<boolean>;
  checkPassword: (pwd: string) => boolean;
  getPhrase: (pwd: string) => string | null;
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

  const isLocked = () => {
    console.log(password, phrase);
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
      account.getPrimaryAccount();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createWallet = async () => {
    if (walletKeystore()) return;
    const v3Keystore = await dag.keyStore.encryptPhrase(phrase, password);
    masterKey = dag.keyStore.getMasterKeyFromMnemonic(phrase);
    store.dispatch(setKeystoreInfo(v3Keystore));
    account.subscribeAccount(0);
  };

  const setWalletPassword = (pwd: string) => {
    password = pwd;
  };

  const walletKeystore = () => {
    const { keystore } = store.getState().wallet;
    return keystore ? keystore : null;
  };

  return {
    account,
    generatedPhrase,
    setWalletPassword,
    createWallet,
    isLocked,
    unLock,
    checkPassword,
    getPhrase,
  };
};

export default WalletController;
