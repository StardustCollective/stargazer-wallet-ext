import { dag } from '@stardust-collective/dag4-wallet';
import store from 'state/store';
import { setKeystoreInfo } from 'state/wallet';
export interface IWalletController {
  createWallet: () => void;
  generatedPhrase: () => string | null;
  setWalletPassword: (str: string) => void;
  isLocked: () => boolean;
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

  const createWallet = async () => {
    const { keystore } = store.getState().wallet;
    if (keystore) return;
    const v3Keystore = await dag.keyStore.encryptPhrase(phrase, password);
    store.dispatch(setKeystoreInfo(v3Keystore));
  };

  const setWalletPassword = (str: string) => {
    password = str;
  };

  return {
    generatedPhrase,
    setWalletPassword,
    createWallet,
    isLocked,
  };
};

export default WalletController;
