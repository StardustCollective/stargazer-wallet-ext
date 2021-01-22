import { dag } from '@stardust-collective/dag4-wallet';
import { Transaction, PendingTx } from '@stardust-collective/dag4-network';
import { hdkey } from 'ethereumjs-wallet';

import store from 'state/store';
import {
  createAccount,
  updateStatus,
  removeAccount,
  updateAccount,
  updateTransactions,
} from 'state/wallet';
import IWalletState, { IAccountState } from 'state/wallet/types';

import { IAccountInfo, ITransactionInfo } from '../../types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => Promise<void>;
  getPrivKey: (index: number, pwd: string) => string | null;
  getPrimaryAccount: () => void;
  isValidDAGAddress: (address: string) => boolean;
  subscribeAccount: (index: number) => Promise<string | null>;
  unsubscribeAccount: (index: number, pwd: string) => boolean;
  addNewAccount: (label: string) => Promise<string | null>;
  updateTxs: (limit?: number, searchAfter?: string) => Promise<void>;
  watchMemPool: () => void;
  getLatestUpdate: () => void;
}

const AccountController = (actions: {
  getMasterKey: () => hdkey | null;
  checkPassword: (pwd: string) => boolean;
}): IAccountController => {
  let privateKey: string;
  let tempTx: ITransactionInfo;
  let account: IAccountState | null;
  let intervalId: any;

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

  const unsubscribeAccount = (index: number, pwd: string) => {
    if (actions.checkPassword(pwd)) {
      store.dispatch(removeAccount(index));
      store.dispatch(updateStatus());
      return true;
    }
    return false;
  };

  const getPrimaryAccount = () => {
    const { accounts, activeIndex }: IWalletState = store.getState().wallet;
    getLatestUpdate();
    if (!account && accounts && Object.keys(accounts).length) {
      account = accounts[activeIndex];
      store.dispatch(updateStatus());
    }
  };

  const getLatestUpdate = async () => {
    const { activeIndex }: IWalletState = store.getState().wallet;
    const res: IAccountInfo | null = await getAccountByIndex(activeIndex);
    if (res) {
      store.dispatch(
        updateAccount({
          index: activeIndex,
          balance: res.balance,
          transactions: res.transactions,
        })
      );
    }
  };

  const getPrivKey = (index: number, pwd: string) => {
    const masterKey: hdkey | null = actions.getMasterKey();
    if (!masterKey) return null;
    return actions.checkPassword(pwd)
      ? dag.keyStore.deriveAccountFromMaster(masterKey, index)
      : null;
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

  const updateTxs = async (limit = 10, searchAfter?: string) => {
    if (!account) return;
    const newTxs = await dag.account.getTransactions(limit, searchAfter);
    store.dispatch(
      updateTransactions({
        index: account.index,
        txs: [...account.transactions, ...newTxs],
      })
    );
  };

  const _coventPendingType = (pending: PendingTx) => {
    return {
      hash: pending.hash,
      amount: pending.amount,
      receiver: pending.receiver,
      sender: pending.sender,
      fee: -1,
      isDummy: true,
      timestamp: new Date(pending.timestamp).toISOString(),
      lastTransactionRef: {},
      snapshotHash: '',
      checkpointBlock: '',
    } as Transaction;
  };

  const watchMemPool = () => {
    intervalId = setInterval(() => {
      const memPool = window.localStorage.getItem('dag4-network-main-mempool');
      if (memPool) {
        const pendingTxs = JSON.parse(memPool);
        console.log(pendingTxs);
        if (!pendingTxs.length) {
          clearInterval(intervalId);
          getLatestUpdate();
          return;
        }
        pendingTxs.forEach((pTx: PendingTx) => {
          if (
            !account ||
            account.transactions.filter(
              (tx: Transaction) => tx.hash === pTx.hash
            ).length > 0
          )
            return;
          store.dispatch(
            updateTransactions({
              index: account.index,
              txs: [_coventPendingType(pTx), ...account.transactions],
            })
          );
        });
      }
    }, 30 * 1000);
  };

  const confirmTempTx = async () => {
    if (dag.account.isActive() && account) {
      const pendingTx = await dag.account.transferDag(
        tempTx.toAddress,
        tempTx.amount
      );
      dag.monitor.addToMemPoolMonitor(pendingTx);
      store.dispatch(
        updateTransactions({
          index: account.index,
          txs: [_coventPendingType(pendingTx), ...account.transactions],
        })
      );
      watchMemPool();
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
    getPrivKey,
    getPrimaryAccount,
    isValidDAGAddress,
    subscribeAccount,
    unsubscribeAccount,
    addNewAccount,
    getLatestUpdate,
    watchMemPool,
    updateTxs,
  };
};

export default AccountController;
