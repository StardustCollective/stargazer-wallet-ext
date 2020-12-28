import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import { updateStatus } from 'state/wallet';

import { IAccountInfo, ITransactionInfo } from '../../types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => Promise<void>;
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

  // Primary
  const getAccountByPrivateKey = async (
    privateKey: string
  ): Promise<IAccountInfo> => {
    dag.account.loginPrivateKey(privateKey);
    // const ethAddress = dag.keyStore.getEthAddressFromPrivateKey(privateKey);
    const balance = await dag.account.getBalance();
    const transactions = await dag.account.getTransactions(2);
    return { address: dag.account.address, balance, transactions };
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

  // Tx-Related
  const updateTempTx = (tx: ITransactionInfo) => {
    if (dag.account.isActive()) {
      tempTx = { ...tx };
    }
  };

  const getTempTx = () => {
    return dag.account.isActive() ? tempTx : null;
  };

  const confirmTempTx = async () => {
    if (dag.account.isActive()) {
      await dag.account.transferDag(tempTx.toAddress, tempTx.amount);
    }
  };

  // Other
  const isValidDAGAddress = (address: string) => {
    return dag.account.validateDagAddress(address);
  };

  return {
    getTempTx,
    updateTempTx,
    confirmTempTx,
    currentAccount,
    getPrimaryAccount,
    isValidDAGAddress,
  };
};

export default AccountController;
