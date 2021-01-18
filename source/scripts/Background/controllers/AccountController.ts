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
  getPrivKey: (pwd: string) => string | null;
  getPrimaryAccount: () => void;
  isValidDAGAddress: (address: string) => boolean;
}

const AccountController = (actions: {
  getMasterKey: () => hdkey | null;
  checkPassword: (pwd: string) => boolean;
}): IAccountController => {
  let privateKey: string;
  let tempTx: ITransactionInfo;
  let account: IAccountInfo | null;

  // Primary
  const getAccountByPrivateKey = async (
    privateKey: string
  ): Promise<IAccountInfo> => {
    dag.account.loginPrivateKey(privateKey);
    // const ethAddress = dag.keyStore.getEthAddressFromPrivateKey(privateKey);
    const balance = await dag.account.getBalance();
    const transactions = await dag.account.getTransactions(10);
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
    dag.monitor.startMonitor();
  };

  const currentAccount = () => {
    return account;
  };

  const getPrivKey = (pwd: string) => {
    return actions.checkPassword(pwd) ? privateKey : null;
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
      const pendingTx = await dag.account.transferDag(
        tempTx.toAddress,
        tempTx.amount
      );
      dag.monitor.addToMemPoolMonitor(pendingTx);
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
    getPrivKey,
    getPrimaryAccount,
    isValidDAGAddress,
  };
};

export default AccountController;
