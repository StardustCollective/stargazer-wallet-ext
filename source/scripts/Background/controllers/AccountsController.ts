import { dag } from '@stardust-collective/dag4-wallet';
// import store from 'state/store';
export interface IAccountsController {
  // createNewWallet: () => void;
  generatePhrase: () => string;
  generatePrivateKey: () => void;
  setWalletPassword: (str: string) => void;
}

const AccountsController = (): IAccountsController => {
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

  // const createNewWallet = async () => {
  //   const keystore = await dag.keyStore.encryptPhrase(password, privateKey);
  // };

  const setWalletPassword = (str: string) => {
    password = str;
  };

  return {
    generatePhrase,
    setWalletPassword,
    generatePrivateKey,
    // createNewWallet,
  };
};

export default AccountsController;
