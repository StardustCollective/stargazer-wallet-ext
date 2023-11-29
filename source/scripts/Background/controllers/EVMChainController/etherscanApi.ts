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

export const getGasOracle = async (
  baseUrl: string,
  apiKey?: string
): Promise<GasOracleResponse> => {
  const params = {
    module: 'gastracker',
    action: 'gasoracle',
    apiKey,
  };
  const url = baseUrl + '/api?' + getParamsFromObject(params);

  const responseJson = await (await fetch(url)).json();
  return responseJson.result;
};

export const getTokenTransactionHistory = async ({
  baseUrl,
  address,
  assetAddress,
  page,
  offset,
  startblock,
  endblock,
  apiKey,
}: TransactionHistoryParam & { baseUrl: string; apiKey?: string }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'tokentx',
    sort: 'desc',
  };
  let url =
    baseUrl +
    `/api?` +
    getParamsFromObject({
      ...initialParams,
      address,
      contractaddress: assetAddress,
      offset,
      page,
      startblock,
      endblock,
      apiKey,
    });

  const responseJson = await (await fetch(url)).json();
  const tokenTransactions: TokenTransactionInfo[] = responseJson.result;

  return filterSelfTxs(tokenTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .reduce((acc, cur) => {
      const tx = getTxFromTokenTransaction(cur);
      return tx ? [...acc, tx] : acc;
    }, [] as Txs);
};

export const getETHTransactionHistory = async ({
  baseUrl,
  address,
  page,
  offset,
  startblock,
  endblock,
  apiKey,
}: TransactionHistoryParam & { baseUrl: string; apiKey?: string }): Promise<Txs> => {
  const initialParams = {
    module: 'account',
    action: 'txlist',
    sort: 'desc',
  };
  let url =
    baseUrl +
    '/api?' +
    getParamsFromObject({
      ...initialParams,
      address,
      offset,
      page,
      startblock,
      endblock,
      apiKey,
    });

  const responseJson = await (await fetch(url)).json();
  let ethTransactions: ETHTransactionInfo[] = responseJson.result;

  const internalUrl = url.replace('txlist', 'txlistinternal');
  const responseInternalJson = await (await fetch(internalUrl)).json();
  const internalTransactions: ETHTransactionInfo[] = responseInternalJson.result;

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
