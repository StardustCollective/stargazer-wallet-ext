import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import { updateStatus } from 'state/wallet';

import { IAccountInfo, ITransactionInfo } from '../../types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  currentAccount: () => IAccountInfo | null;
  getPrimaryAccount: () => void;
  isValidDAGAddress: (address: string) => boolean;
}

const AccountController = (actions: {
  getMasterKey: () => hdkey | null;
}): IAccountController => {
  let privateKey;
  let tempTx: ITransactionInfo;
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

  const isValidDAGAddress = (address: string) => {
    return dag.account.validateDagAddress(address);
  };

  const getPrimaryAccount = async () => {
    account = await getAccountByIndex(0);
    store.dispatch(updateStatus());
  };

  const updateTempTx = (tx: ITransactionInfo) => {
    tempTx = { ...tx };
  };

  const getTempTx = () => {
    return account ? tempTx : null;
  };

  const currentAccount = () => {
    return account;
  };

  return {
    getTempTx,
    updateTempTx,
    currentAccount,
    getPrimaryAccount,
    isValidDAGAddress,
  };
};

export default AccountController;
