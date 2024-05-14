import * as ethers from 'ethers';
import { dag4 } from '@stardust-collective/dag4';
import { Transaction, TransactionV2 } from '@stardust-collective/dag4-network';
import { StargazerProxyRequest } from 'scripts/common';

export const dag_getTransaction = async (
  request: StargazerProxyRequest & { type: 'rpc' }
): Promise<null | Transaction | TransactionV2> => {
  const [hash] = request.params as [unknown];

  if (typeof hash !== 'string') {
    throw new Error("Bad argument 'hash' -> not a string");
  }

  if (!ethers.utils.isHexString(`0x${hash}`, 32)) {
    throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
  }

  try {
    return await dag4.network.getTransaction(hash);
  } catch (e) {
    console.error('dag_getTransaction:', e);
    return null;
  }
};
