import { bn } from '@xchainjs/xchain-util/lib';
import { Txs } from '../ChainsController';
import { 
  ETHTransactionInfo, 
  GasOracleResponse, 
  TokenTransactionInfo, 
  TransactionHistoryParam 
} from './etherscanApi.types';
import { 
  filterSelfTxs, 
  getTxFromEthTransaction, 
  getTxFromTokenTransaction 
} from './utils';

const getApiKeyQueryParameter = (apiKey?: string): string => (!!apiKey ? `&apiKey=${apiKey}` : '')

export const getGasOracle = async (baseUrl: string, apiKey?: string): Promise<GasOracleResponse> => {
  const url = baseUrl + '/api?module=gastracker&action=gasoracle';

  const responseJson = await (await fetch(url + getApiKeyQueryParameter(apiKey))).json();
  return responseJson.result;
}

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
  let url = baseUrl + `/api?module=account&action=tokentx&sort=desc` + getApiKeyQueryParameter(apiKey)
  if (address) url += `&address=${address}`
  if (assetAddress) url += `&contractaddress=${assetAddress}`
  if (offset) url += `&offset=${offset}`
  if (page) url += `&page=${page}`
  if (startblock) url += `&startblock=${startblock}`
  if (endblock) url += `&endblock=${endblock}`
 
  const responseJson = await (await fetch(url)).json();
  const tokenTransactions: TokenTransactionInfo[] = responseJson.result;

  return filterSelfTxs(tokenTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .reduce((acc, cur) => {
      const tx = getTxFromTokenTransaction(cur)
      return tx ? [...acc, tx] : acc
    }, [] as Txs)
}

export const getETHTransactionHistory = async ({
  baseUrl,
  address,
  page,
  offset,
  startblock,
  endblock,
  apiKey,
}: TransactionHistoryParam & { baseUrl: string; apiKey?: string }): Promise<Txs> => {
  let url = baseUrl + `/api?module=account&action=txlist&sort=desc` + getApiKeyQueryParameter(apiKey)
  if (address) url += `&address=${address}`
  if (offset) url += `&offset=${offset}`
  if (page) url += `&page=${page}`
  if (startblock) url += `&startblock=${startblock}`
  if (endblock) url += `&endblock=${endblock}`

  const responseJson = await (await fetch(url)).json();
  const ethTransactions: ETHTransactionInfo[] = responseJson.result;

  return filterSelfTxs(ethTransactions)
    .filter((tx) => !bn(tx.value).isZero())
    .map(getTxFromEthTransaction)
}