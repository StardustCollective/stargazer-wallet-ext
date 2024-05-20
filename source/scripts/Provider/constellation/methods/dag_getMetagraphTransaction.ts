import { dag4 } from '@stardust-collective/dag4';

import * as ethers from 'ethers';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { validateMetagraphAddress } from '../utils';

export type StargazerMetagraphGetTransactionRequest = {
  metagraphAddress: string;
  hash: string;
};

export const dag_getMetagraphTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
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

  validateMetagraphAddress(txMetagraphAddress);

  try {
    const response =
      await dag4.account.networkInstance.blockExplorerV2Api.getCurrencyTransaction(
        txMetagraphAddress,
        txHash
      );
    return response?.data ? response.data : null;
  } catch (e) {
    console.error('dag_getMetagraphTransaction:', e);
    return null;
  }
};
