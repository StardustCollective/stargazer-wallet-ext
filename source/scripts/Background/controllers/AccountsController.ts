import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';

import { IAccountInfo } from '../../types';
export interface IAccountsController {
  getPrimaryAccount: () => Promise<IAccountInfo | null>;
}

const AccountsController = (actions: {
  getMasterKey: () => hdkey | null;
}): IAccountsController => {
  let privateKey;

  const getAccountByPrivateKey = async (privateKey: string) => {
    console.log('invoked');
    dag.account.loginPrivateKey(privateKey);
    console.log('login');
    console.log(dag.account.address);
    // const ethAddress = dag.keyStore.getEthAddressFromPrivateKey(privateKey);
    // const balance = await dag.account.getBalance();
    // console.log(balance);
    dag.account.getBalance().then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );

    return { address: dag.account.address, balance: 0 };
  };

  const getAccountByIndex = async (index: number) => {
    const masterKey: hdkey | null = actions.getMasterKey();
    console.log(masterKey);
    if (!masterKey) return null; // temp case
    privateKey = dag.keyStore.deriveAccountFromMaster(masterKey, index);
    return await getAccountByPrivateKey(privateKey);
  };

  const getPrimaryAccount = async () => {
    return await getAccountByIndex(0);
  };

  return {
    getPrimaryAccount,
  };
};

export default AccountsController;
