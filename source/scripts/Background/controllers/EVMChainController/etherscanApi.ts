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
import { ExternalApi } from 'utils/httpRequests/apis';

export const getGasOracle = async (
  explorerID: string,
  chainId: number
): Promise<GasOracleResponse> => {
  const params = {
    module: 'gastracker',
    action: 'gasoracle',
  };
  const url = explorerID + `/api?chainid=${chainId}&` + getParamsFromObject(params);

  const response = await ExternalApi.get(url);
  return response?.data?.message === 'OK' ? response?.data?.result ?? {} : {};
};

export const getTokenTransactionHistory = async ({
  explorerID,
  chainId,
  address,
  assetAddress,
  page,
  offset,
  startblock,
  endblock,
}: TransactionHistoryParam & { explorerID: string; chainId: number }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
  };
  let url =
    explorerID +
    `/api?chainid=${chainId}&` +
    getParamsFromObject({
      ...initialParams,
      address,
      contractaddress: assetAddress,
      offset,
      page,
      startblock,
      endblock,
    });

  const response = await ExternalApi.get(url);
  const tokenTransactions: TokenTransactionInfo[] =
    response?.data?.message === 'OK' ? response?.data?.result ?? [] : [];

  return filterSelfTxs(tokenTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .reduce((acc, cur) => {
      const tx = getTxFromTokenTransaction(cur);
      return tx ? [...acc, tx] : acc;
    }, [] as Txs);
};

export const getETHTransactionHistory = async ({
  explorerID,
  chainId,
  address,
  page,
  offset,
  startblock,
  endblock,
}: TransactionHistoryParam & { explorerID: string; chainId: number }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'txlist',
    sort: 'desc',
  };
  const url =
    explorerID +
    `/api?chainid=${chainId}&` +
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
    ExternalApi.get(url),
    ExternalApi.get(internalUrl),
  ]);

  let ethTransactions: ETHTransactionInfo[] =
    txsResponse?.data?.message === 'OK' ? txsResponse?.data?.result ?? [] : [];

  const internalTransactions: ETHTransactionInfo[] =
    internalTxsResponse?.data?.message === 'OK'
      ? internalTxsResponse?.data?.result ?? []
      : [];

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
