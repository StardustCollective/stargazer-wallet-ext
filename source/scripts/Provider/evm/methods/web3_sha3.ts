import * as ethers from 'ethers';
import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';

export const web3_sha3 = (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
) => {
  return ethers.utils.keccak256(request.params[0]);
};
