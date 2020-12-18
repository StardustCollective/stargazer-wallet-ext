import { dag } from '@stardust-collective/dag4-wallet';
import store from 'state/store';
import { setKeystoreInfo, updateStatus } from 'state/wallet';
export interface IWalletController {
  createWallet: () => void;
  generatedPhrase: () => string | null;
  setWalletPassword: (pwd: string) => void;
  isLocked: () => boolean;
  unLock: (pwd: string) => Promise<boolean>;
}

const WalletController = (): IWalletController => {
  let password = '';
  let phrase = '';
  // let masterKey = '';

  const generatedPhrase = () => {
    const { keystore } = store.getState().wallet;
    if (!keystore && !phrase) {
      phrase = dag.keyStore.generateSeedPhrase();
    }
    return keystore ? null : phrase;
  };

  const isLocked = () => {
    return !password || !phrase;
  };

  const unLock = async (pwd: string): Promise<boolean> => {
    const keystore = walletKeystore();
    if (!keystore) return false;
    try {
      phrase = await dag.keyStore.decryptPhrase(keystore, pwd);
      password = pwd;
      store.dispatch(updateStatus());
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createWallet = async () => {
    if (walletKeystore()) return;
    const v3Keystore = await dag.keyStore.encryptPhrase(phrase, password);
    store.dispatch(setKeystoreInfo(v3Keystore));
  };

  const setWalletPassword = (pwd: string) => {
    password = pwd;
  };

  const walletKeystore = () => {
    const { keystore } = store.getState().wallet;
    return keystore ? keystore : null;
  };

  return {
    generatedPhrase,
    setWalletPassword,
    createWallet,
    isLocked,
    unLock,
  };
};

export default WalletController;
