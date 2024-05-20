import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import { getChainId } from '../utils';

export const dag_chainId = (
  _request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  return getChainId();
};
