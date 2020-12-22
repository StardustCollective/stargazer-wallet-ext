import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import { updateStatus } from 'state/wallet';

import { IAccountInfo } from '../../types';
export interface IAccountsController {
  currentAccount: () => IAccountInfo | null;
  getPrimaryAccount: () => void;
}

const AccountsController = (actions: {
  getMasterKey: () => hdkey | null;
}): IAccountsController => {
  let privateKey;
  let account: IAccountInfo | null;

  const getAccountByPrivateKey = async (privateKey: string) => {
    dag.account.loginPrivateKey(privateKey);
    // const ethAddress = dag.keyStore.getEthAddressFromPrivateKey(privateKey);
    const balance = await dag.account.getBalance();

    return { address: dag.account.address, balance };
  };

  const getAccountByIndex = async (index: number) => {
    const masterKey: hdkey | null = actions.getMasterKey();
    if (!masterKey) return null;
    privateKey = dag.keyStore.deriveAccountFromMaster(masterKey, index);
    return await getAccountByPrivateKey(privateKey);
  };

  const getPrimaryAccount = async () => {
    account = await getAccountByIndex(0);
    store.dispatch(updateStatus());
  };

  const currentAccount = () => {
    return account;
  };

  return {
    currentAccount,
    getPrimaryAccount,
  };
};

export default AccountsController;
