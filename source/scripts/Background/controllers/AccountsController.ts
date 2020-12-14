import { dag } from '@stardust-collective/dag-wallet-sdk';

export interface IAccountsController {
  generatePhrase: () => string;
}

const AccountsController = (): IAccountsController => {
  // let password = ''; // wallet password
  let phrase = ''; // wallet phrase

  const generatePhrase = () => {
    phrase = dag.keyStore.generateSeedPhrase();
    return phrase;
  };

  return {
    generatePhrase,
  };
};

export default AccountsController;
