import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import store from 'state/store';
import { IETHPendingTx } from 'scripts/types';
import { ethers } from 'ethers';
import { IAssetInfoState } from '../../../state/assets/types';
import IVaultState  from 'state/vault/types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export interface IEthTransactionController {
  addPendingTx: (tx: IETHPendingTx) => boolean;
  startMonitor: () => void;
  getFullTxs: () => any[];
}

interface IPendingData {
  [txHash: string]: IETHPendingTx;
}

const TX_STORE = 'ETH_PENDING';

export class EthTransactionController implements IEthTransactionController {

  private ethClient: XChainEthClient = new XChainEthClient({
    network: 'mainnet',
    privateKey: process.env.TEST_PRIVATE_KEY,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  });

  private _getPendingData () {
    const state = localStorage.getItem(TX_STORE) || '{}';
    const pendingData = JSON.parse(state);
    return pendingData as IPendingData;
  };

  setNetwork(value: 'mainnet' | 'testnet') {
    this.ethClient = new XChainEthClient({
      network: value,
      privateKey: process.env.TEST_PRIVATE_KEY,
      etherscanApiKey: process.env.ETHERSCAN_API_KEY,
      infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
    });
  }

  addPendingTx (pendingTx: IETHPendingTx) {
    const pendingData = this._getPendingData();

    if (Object.keys(pendingData).includes(pendingTx.txHash)) {
      return false;
    }
    pendingData[pendingTx.txHash] = pendingTx;
    localStorage.setItem(TX_STORE, JSON.stringify(pendingData));
    this.startMonitor();
    return true;
  };

  removePendingTxHash(txHash: string) {
    const pendingData = this._getPendingData();

    if (pendingData[txHash]) {
      delete pendingData[txHash];
      localStorage.setItem(TX_STORE, JSON.stringify(pendingData));
      window.controller.wallet.account.getLatestTxUpdate();
    }
  };

  getFullTxs() {
    const pendingData = this._getPendingData();
    const { activeAsset, activeNetwork }: IVaultState = store.getState().vault;

    const filteredData = Object.values(pendingData).filter(
      (pendingTx: IETHPendingTx) =>
        pendingTx.network === activeNetwork[KeyringNetwork.Ethereum] &&
        pendingTx.assetId === activeAsset.id
    );

    return [
      ...filteredData,
      ...activeAsset.transactions,
    ];
  };

  startMonitor() {
    const pendingData = this._getPendingData();

    Object.values(pendingData).forEach((pendingTx: IETHPendingTx) => {
      this.ethClient
        .waitForTransaction(
          pendingTx.txHash,
          pendingTx.network === 'mainnet' ? 1 : 3
        )
        .then(() => {
          this.removePendingTxHash(pendingTx.txHash);
        });
    });
  };

  async getTransactionHistory(ethAddress: string, limit: number) {
    const ethTxs = await this.ethClient.getTransactions({
      address: ethAddress,
      limit: limit,
    });

    return {
      transactions: ethTxs.txs.map((tx) => {
        return {
          ...tx,
          timestamp: tx.date.valueOf(),
          balance: ethers.utils.formatEther(
            tx.from[0].amount.amount().toString()
          ),
        };
      })
    };
  }

  async getTokenTransactionHistory(ethAddress: string, asset: IAssetInfoState, limit: number) {

    const transactions = await this.ethClient.getTransactions({
      address: ethAddress,
      limit: limit,
      asset: asset.address,
    });

    return {
      transactions: transactions.txs.map((tx) => {
        return {
          ...tx,
          timestamp: tx.date.valueOf(),
          balance: ethers.utils.formatUnits(
            tx.from[0].amount.amount().toString(),
            asset.decimals || 18
          ),
        };
      })
    }
  }

}

