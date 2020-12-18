import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';

export interface IAccountsController {
  getPrimaryAccount: () => string[];
}

const AccountsController = (actions: {
  getMasterKey: () => hdkey | null;
}): IAccountsController => {
  let privateKey;

  const getAccountByPrivateKey = (privateKey: string) => {
    const dagAddres = dag.keyStore.getDagAddressFromPrivateKey(privateKey);
    const ethAddress = dag.keyStore.getEthAddressFromPrivateKey(privateKey);

    return [dagAddres, ethAddress];
  };

  const getAccountByIndex = (index: number) => {
    const masterKey: hdkey | null = actions.getMasterKey();
    console.log(masterKey);
    if (!masterKey) return ['', '']; // temp case
    privateKey = dag.keyStore.deriveAccountFromMaster(masterKey, index);
    return getAccountByPrivateKey(privateKey);
  };

  const getPrimaryAccount = () => {
    return getAccountByIndex(0);
  };

  return {
    getPrimaryAccount,
  };
};

export default AccountsController;
