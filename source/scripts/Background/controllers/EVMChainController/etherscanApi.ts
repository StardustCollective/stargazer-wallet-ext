import { bn } from '@xchainjs/xchain-util/lib';
import { Txs } from '../ChainsController';
import {
  ETHTransactionInfo,
  GasOracleResponse,
  TokenTransactionInfo,
  TransactionHistoryParam,
} from './etherscanApi.types';
import {
  filterSelfTxs,
  getTxFromEthTransaction,
  getTxFromTokenTransaction,
} from './utils';
import { getParamsFromObject } from 'utils/objects';
import { ExplorerApi } from 'utils/httpRequests/apis';

export const getGasOracle = async (explorerID: string): Promise<GasOracleResponse> => {
  const params = {
    module: 'gastracker',
    action: 'gasoracle',
  };
  const url = explorerID + '/api?' + getParamsFromObject(params);

  const response = await ExplorerApi.get(url);
  return response?.data?.result ?? {};
};

export const getTokenTransactionHistory = async ({
  explorerID,
  address,
  assetAddress,
  page,
  offset,
  startblock,
  endblock,
}: TransactionHistoryParam & { explorerID: string }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
  };
  let url =
    explorerID +
    `/api?` +
    getParamsFromObject({
      ...initialParams,
      address,
      contractaddress: assetAddress,
      offset,
      page,
      startblock,
      endblock,
    });

  const response = await ExplorerApi.get(url);
  const tokenTransactions: TokenTransactionInfo[] = response?.data?.result ?? [];

  return filterSelfTxs(tokenTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .reduce((acc, cur) => {
      const tx = getTxFromTokenTransaction(cur);
      return tx ? [...acc, tx] : acc;
    }, [] as Txs);
};

export const getETHTransactionHistory = async ({
  explorerID,
  address,
  page,
  offset,
  startblock,
  endblock,
}: TransactionHistoryParam & { explorerID: string }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'txlist',
    sort: 'desc',
  };
  const url =
    explorerID +
    '/api?' +
    getParamsFromObject({
      ...initialParams,
      address,
      offset,
      page,
      startblock,
      endblock,
    });

  const internalUrl = url.replace('txlist', 'txlistinternal');
  const [txsResponse, internalTxsResponse] = await Promise.all([
    ExplorerApi.get(url),
    ExplorerApi.get(internalUrl),
  ]);

  let ethTransactions: ETHTransactionInfo[] = txsResponse?.data?.result ?? [];

  const internalTransactions: ETHTransactionInfo[] =
    internalTxsResponse?.data?.result ?? [];

  if (!!internalTransactions.length) {
    // Adds internal transactions and sorts by timestamp
    ethTransactions = ethTransactions
      .concat(internalTransactions)
      .sort((txA, txB) => (txA.timeStamp > txB.timeStamp ? 1 : -1));
  }

  return filterSelfTxs(ethTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .map(getTxFromEthTransaction);
};
