import * as ethers from 'ethers';
import { StargazerProxyRequest } from 'scripts/common';

export const web3_sha3 = (request: StargazerProxyRequest & { type: 'rpc' }): string => {
  return ethers.utils.keccak256(request.params[0]);
};
