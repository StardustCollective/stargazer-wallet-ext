import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import store from 'state/store';
import { IETHPendingTx } from 'scripts/types';
import IWalletState, { AssetType } from 'state/wallet/types';

export interface ITransactionController {
  addPendingTx: (tx: IETHPendingTx) => boolean;
  startMonitor: () => void;
  getFullTxs: () => any[];
}

interface IPendingData {
  [txHash: string]: IETHPendingTx;
}

const TransactionController = ({
  getLatestUpdate,
}: {
  getLatestUpdate: () => void;
}): ITransactionController => {
  const TX_STORE = 'ETH_PENDING';

  const ethClient: XChainEthClient = new XChainEthClient({
    network: 'mainnet',
    privateKey: process.env.TEST_PRIVATE_KEY,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  });

  const _getPendingData = () => {
    const state = localStorage.getItem(TX_STORE) || '{}';
    const pendingData = JSON.parse(state);
    return pendingData as IPendingData;
  };

  const addPendingTx = (pendingTx: IETHPendingTx) => {
    const pendingData = _getPendingData();

    if (Object.keys(pendingData).includes(pendingTx.txHash)) {
      return false;
    }
    pendingData[pendingTx.txHash] = pendingTx;
    localStorage.setItem(TX_STORE, JSON.stringify(pendingData));
    startMonitor();
    return true;
  };

  const removePendingTxHash = (txHash: string) => {
    const pendingData = _getPendingData();

    if (pendingData[txHash]) {
      delete pendingData[txHash];
      localStorage.setItem(TX_STORE, JSON.stringify(pendingData));
      getLatestUpdate();
    }
  };

  const getFullTxs = () => {
    const pendingData = _getPendingData();
    const {
      accounts,
      activeAccountId,
      activeNetwork,
    }: IWalletState = store.getState().wallet;
    const account = accounts[activeAccountId];

    const filteredData = Object.values(pendingData).filter(
      (pendingTx: IETHPendingTx) =>
        pendingTx.network === activeNetwork[AssetType.Ethereum] &&
        pendingTx.assetId === account.activeAssetId
    );

    return [
      ...filteredData,
      ...account.assets[account.activeAssetId].transactions,
    ];
  };

  const startMonitor = () => {
    const pendingData = _getPendingData();

    Object.values(pendingData).forEach((pendingTx: IETHPendingTx) => {
      ethClient
        .waitForTransaction(
          pendingTx.txHash,
          pendingTx.network === 'mainnet' ? 1 : 3
        )
        .then(() => {
          removePendingTxHash(pendingTx.txHash);
        });
    });
  };

  return {
    startMonitor,
    addPendingTx,
    getFullTxs,
  };
};

export default TransactionController;
