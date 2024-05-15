import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { getChainId } from '../utils';

export const dag_chainId = (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  return getChainId();
};
