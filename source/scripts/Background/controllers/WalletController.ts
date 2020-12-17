import { dag } from '@stardust-collective/dag4-wallet';
import store from 'state/store';
import { setKeystoreInfo } from 'state/wallet';
export interface IWalletController {
  createNewWallet: () => void;
  generatePhrase: () => string;
  generatePrivateKey: () => void;
  setWalletPassword: (str: string) => void;
}

const WalletController = (): IWalletController => {
  let password = '';
  let phrase = '';
  let privateKey = '';
  // let masterKey = '';

  const generatePhrase = () => {
    phrase = dag.keyStore.generateSeedPhrase();
    return phrase;
  };

  const generatePrivateKey = () => {
    privateKey = dag.keyStore.getPrivateKeyFromMnemonic(phrase);
  };

  const createNewWallet = async () => {
    const keystore = await dag.keyStore.encryptPhrase(password, privateKey);
    store.dispatch(setKeystoreInfo(keystore));
  };

  const setWalletPassword = (str: string) => {
    password = str;
  };

  return {
    generatePhrase,
    setWalletPassword,
    generatePrivateKey,
    createNewWallet,
  };
};

export default WalletController;
