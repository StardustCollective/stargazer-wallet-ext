import store from 'state/store';
import { IETHPendingTx } from 'scripts/types';
import { ethers } from 'ethers';
import IVaultState from 'state/vault/types';
import { IAssetInfoState } from '../../../state/assets/types';
import { AccountController } from './AccountController';
import localStorage from 'utils/localStorage';

export interface IEthTransactionController {
  addPendingTx: (tx: IETHPendingTx) => Promise<boolean>;
  startMonitor: () => Promise<void>;
  getFullTxs: () => Promise<any[]>;
}

interface IPendingData {
  [txHash: string]: IETHPendingTx;
}

type ITransactionListeners = {
  [txHash: string]: {
    onConfirmed?: () => void;
  };
};

const TX_STORE = 'ETH_PENDING';

export class EthTransactionController implements IEthTransactionController {
  accountController: AccountController;

  constructor(accountController: AccountController) {
    this.accountController = accountController;
  }

  private async _getPendingData() {
    const state = (await localStorage.getItem(TX_STORE)) || '{}';
    try {
      return JSON.parse(state) as IPendingData;
    } catch (err: any) {
      console.log('_getPendingData invalid JSON');
      return {};
    }
  }

  private _transactionListeners: ITransactionListeners = {};

  async addPendingTx(pendingTx: IETHPendingTx) {
    let pendingData;
    try {
      pendingData = await this._getPendingData();
    } catch (err: any) {
      console.log('addPendingTX err: ', err);
      console.log(err.stack);
    }

    if (!pendingData || Object.keys(pendingData).includes(pendingTx.txHash)) {
      return false;
    }

    pendingData[pendingTx.txHash] = pendingTx;
    await localStorage.setItem(TX_STORE, JSON.stringify(pendingData));

    if (pendingTx.onConfirmed) {
      this._transactionListeners[pendingTx.txHash] = {
        onConfirmed: pendingTx.onConfirmed,
      };
    }

    await this.startMonitor();
    return true;
  }

  async removePendingTxHash(txHash: string) {
    const pendingData = await this._getPendingData();

    if (pendingData[txHash]) {
      delete pendingData[txHash];
      await localStorage.setItem(TX_STORE, JSON.stringify(pendingData));
      // Wait for 20 seconds before fetching transactions
      await new Promise((resolve) => setTimeout(resolve, 20000));
      await this.accountController.getLatestTxUpdate(false);
    }
  }

  async getFullTxs() {
    const pendingData = await this._getPendingData();
    const { activeAsset }: IVaultState = store.getState().vault;
    const { id: networkId } = this.accountController.networkController.getNetwork();

    const filteredData = Object.values(pendingData).filter(
      (pendingTx: IETHPendingTx) =>
        pendingTx.network === networkId && pendingTx.assetId === activeAsset.id
    );

    return [...filteredData, ...activeAsset.transactions];
  }

  async startMonitor() {
    const pendingData = await this._getPendingData();

    Object.values(pendingData).forEach((pendingTx: IETHPendingTx) => {
      this.accountController.networkController
        .waitForTransaction(pendingTx.txHash)
        .then(() => {
          console.log('removing pending tx');
          if (
            this._transactionListeners[pendingTx.txHash] &&
            this._transactionListeners[pendingTx.txHash].onConfirmed
          ) {
            this._transactionListeners[pendingTx.txHash].onConfirmed();
          }

          return this.removePendingTxHash(pendingTx.txHash);
        });
    });
  }

  async getTransactionHistory(ethAddress: string, limit: number) {
    const ethTxs = await this.accountController.networkController.getTransactions({
      address: ethAddress,
      limit,
    });

    return {
      transactions: ethTxs.txs.map((tx) => ({
        ...tx,
        timestamp: tx.date.valueOf(),
        balance: ethers.utils.formatEther(tx.from[0].amount.amount().toString()),
      })),
    };
  }

  async getTokenTransactionHistory(
    ethAddress: string,
    asset: IAssetInfoState,
    limit: number
  ) {
    const transactions = await this.accountController.networkController.getTransactions({
      address: ethAddress,
      limit,
      asset: asset.address,
    });

    return {
      transactions: transactions.txs.map((tx) => ({
        ...tx,
        timestamp: tx.date.valueOf(),
        balance: ethers.utils.formatUnits(
          tx.from[0].amount.amount().toFixed(),
          asset.decimals || 18
        ),
      })),
    };
  }
}
