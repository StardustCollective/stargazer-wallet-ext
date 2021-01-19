import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';

import store from 'state/store';
import { createAccount, updateStatus } from 'state/wallet';
import IWalletState, { IAccountState } from 'state/wallet/types';

import { IAccountInfo, ITransactionInfo } from '../../types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => Promise<void>;
  currentAccount: () => IAccountInfo | null;
  getPrivKey: (pwd: string) => string | null;
  getPrimaryAccount: () => void;
  isValidDAGAddress: (address: string) => boolean;
  subscribeAccount: (index: number) => Promise<string | null>;
  addNewAccount: (label: string) => Promise<string | null>;
}

const AccountController = (actions: {
  getMasterKey: () => hdkey | null;
  checkPassword: (pwd: string) => boolean;
}): IAccountController => {
  let privateKey: string;
  let tempTx: ITransactionInfo;
  let account: IAccountState | null;

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

  const subscribeAccount = async (index: number, label?: string) => {
    const { accounts }: IWalletState = store.getState().wallet;
    if (accounts && Object.keys(accounts).includes(String(index))) return null;
    const res: IAccountInfo | null = await getAccountByIndex(index);

    account = {
      index,
      label: label || `Account ${index + 1}`,
      address: res!.address,
      balance: res!.balance,
      transactions: res!.transactions,
    };

    store.dispatch(createAccount(account));
    return account!.address;
  };

  const addNewAccount = async (label: string) => {
    const { accounts }: IWalletState = store.getState().wallet;
    let idx = -1;
    Object.keys(accounts).forEach((index, i) => {
      if (index !== String(i)) {
        idx = i;
        return;
      }
    });
    if (idx === -1) {
      idx = Object.keys(accounts).length;
    }
    return await subscribeAccount(idx, label);
  };

  const getPrimaryAccount = () => {
    const { accounts, activeIndex }: IWalletState = store.getState().wallet;
    if (!account && accounts && Object.keys(accounts).length) {
      account = accounts[activeIndex];
      store.dispatch(updateStatus());
    }
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
    subscribeAccount,
    addNewAccount,
  };
};

export default AccountController;
