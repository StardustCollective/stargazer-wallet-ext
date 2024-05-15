import * as ethers from 'ethers';
import { dag4 } from '@stardust-collective/dag4';
import { PendingTransaction, CbTransaction } from '@stardust-collective/dag4-network';
import { StargazerProxyRequest } from 'scripts/common';

export const dag_getPendingTransaction = async (
  request: StargazerProxyRequest & { type: 'rpc' }
): Promise<null | PendingTransaction | CbTransaction> => {
  const [hash] = request.params as [unknown];

  if (typeof hash !== 'string') {
    throw new Error("Bad argument 'hash' -> not a string");
  }

  if (!ethers.utils.isHexString(`0x${hash}`, 32)) {
    throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
  }

  try {
    return await dag4.network.getPendingTransaction(hash);
  } catch (e) {
    console.error('dag_getPendingTransaction:', e);
    return null;
  }
};
