import * as ethers from 'ethers';
import { dag4 } from '@stardust-collective/dag4';

import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

export const dag_getTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
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
