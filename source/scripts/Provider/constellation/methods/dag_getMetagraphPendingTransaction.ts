import { dag4 } from '@stardust-collective/dag4';
import * as ethers from 'ethers';
import { PendingTransaction } from '@stardust-collective/dag4-network';
import { StargazerProxyRequest } from 'scripts/common';
import { validateMetagraphAddress } from '../utils';
import { DAG_NETWORK } from 'constants/index';
import { StargazerMetagraphGetTransactionRequest } from './dag_getMetagraphTransaction';
import store from 'state/store';

export const dag_getMetagraphPendingTransaction = async (
  request: StargazerProxyRequest & { type: 'rpc' }
): Promise<null | PendingTransaction> => {
  const { vault, assets } = store.getState();

  const [txData] = request.params as [StargazerMetagraphGetTransactionRequest];

  const txMetagraphAddress = txData.metagraphAddress;
  const txHash = txData.hash;

  if (!txMetagraphAddress) {
    throw new Error("'metagraphAddress' is required");
  }

  if (!txHash) {
    throw new Error("'hash' is required");
  }

  if (typeof txMetagraphAddress !== 'string') {
    throw new Error("Bad argument 'metagraphAddress' -> not a string");
  }

  if (typeof txHash !== 'string') {
    throw new Error("Bad argument 'hash' -> not a string");
  }

  if (!ethers.utils.isHexString(`0x${txHash}`, 32)) {
    throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
  }

  const metagraphToken = validateMetagraphAddress(txMetagraphAddress);

  const metagraphTokenInfo = assets[metagraphToken?.id];

  if (!metagraphTokenInfo) {
    throw new Error("'metagraphAddress' not found in wallet");
  }

  const { address, l0endpoint, l1endpoint } = metagraphTokenInfo;
  const { beUrl } = DAG_NETWORK[vault.activeNetwork.Constellation].config;
  const metagraphClient = dag4.account.createMetagraphTokenClient({
    id: address,
    metagraphId: address,
    l0Url: l0endpoint,
    l1Url: l1endpoint,
    beUrl,
  });

  try {
    return metagraphClient.networkInstance.getPendingTransaction(txHash);
  } catch (e) {
    console.error('dag_getMetagraphPendingTransaction:', e);
    return null;
  }
};
