import { dag } from '@stardust-collective/dag4-wallet';
import { hdkey } from 'ethereumjs-wallet';
import store from 'state/store';
import { updateStatus } from 'state/wallet';

import { IAccountInfo, ITransactionInfo } from '../../types';
export interface IAccountController {
  getTempTx: () => ITransactionInfo | null;
  updateTempTx: (tx: ITransactionInfo) => void;
  confirmTempTx: () => void;
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

  // Tx-Related
  const updateTempTx = (tx: ITransactionInfo) => {
    if (dag.account.isActive()) {
      tempTx = { ...tx };
    }
  };

  const getTempTx = () => {
    return dag.account.isActive() ? tempTx : null;
  };

  const confirmTempTx = () => {
    if (dag.account.isActive()) {
      dag.account.transferDag(tempTx.toAddress, tempTx.amount).then(() => {
        store.dispatch(updateStatus());
      });
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
