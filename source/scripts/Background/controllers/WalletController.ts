import { dag } from '@stardust-collective/dag4-wallet';
import store from 'state/store';
import { setKeystoreInfo } from 'state/wallet';
export interface IWalletController {
  createWallet: () => void;
  generatedPhrase: () => string | null;
  setWalletPassword: (str: string) => void;
}

const WalletController = (): IWalletController => {
  let password = '';
  let phrase = '';
  let privateKey = '';
  // let masterKey = '';

  const generatedPhrase = () => {
    const { keystore } = store.getState().wallet;
    if (!keystore && !phrase) {
      phrase = dag.keyStore.generateSeedPhrase();
    }
    return keystore ? null : phrase;
  };

  const createWallet = async () => {
    const { keystore } = store.getState().wallet;
    if (keystore) return;
    _generatePrivateKey();
    const v3Keystore = await dag.keyStore.encryptPhrase(phrase, password);
    store.dispatch(setKeystoreInfo(v3Keystore));
  };

  const setWalletPassword = (str: string) => {
    password = str;
  };

  const _generatePrivateKey = () => {
    privateKey = dag.keyStore.getPrivateKeyFromMnemonic(phrase);
  };

  return {
    generatedPhrase,
    setWalletPassword,
    createWallet,
  };
};

export default WalletController;
