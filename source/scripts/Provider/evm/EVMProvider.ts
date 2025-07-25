import { getChainInfo } from 'scripts/Background/controllers/EVMChainController/utils';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';

import { AvailableMethods, EIPErrorCodes, EIPRpcError, IRpcChainRequestHandler, StargazerRequest, StargazerRequestMessage } from '../../common';

import { eth_accounts, eth_requestAccounts, eth_sendTransaction, eth_signTypedData, personal_sign, wallet_switchEthereumChain, web3_clientVersion, web3_sha3 } from './methods';
import StargazerRpcProvider from './StargazerRpcProvider';
import { getNetworkInfo } from './utils';

export class EVMProvider implements IRpcChainRequestHandler {
  async handleProxiedRequest(request: StargazerRequest & { type: 'rpc' }, _message: StargazerRequestMessage, _sender: chrome.runtime.MessageSender) {
    const networkInfo = getNetworkInfo();
    const chainInfo = getChainInfo(networkInfo.chainId);
    const provider = new StargazerRpcProvider(chainInfo.rpcEndpoint);

    return provider.send(request.method, request.params);
  }

  async handleNonProxiedRequest(request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) {
    const UNAUTH_METHODS = [AvailableMethods.eth_requestAccounts, AvailableMethods.eth_accounts];

    // Provider needs to be activated before calling any other RPC method
    if (!isDappConnected(sender.origin) && !UNAUTH_METHODS.includes(request.method)) {
      throw new EIPRpcError('Provider is not activated. Call eth_requestAccounts to activate it.', EIPErrorCodes.Unauthorized);
    }

    switch (request.method) {
      case AvailableMethods.eth_requestAccounts:
        return eth_requestAccounts(request, message, sender);
      case AvailableMethods.eth_accounts:
        return eth_accounts(request, message, sender);
      case AvailableMethods.personal_sign:
        return personal_sign(request, message, sender);
      case AvailableMethods.eth_signTypedData:
      case AvailableMethods.eth_signTypedData_v4:
        return eth_signTypedData(request, message, sender);
      case AvailableMethods.eth_sendTransaction:
        return eth_sendTransaction(request, message, sender);
      case AvailableMethods.web3_sha3:
        return web3_sha3(request, message, sender);
      case AvailableMethods.web3_clientVersion:
        return web3_clientVersion(request, message, sender);
      case AvailableMethods.wallet_switchEthereumChain:
        return wallet_switchEthereumChain(request, message, sender);
      default:
        throw new EIPRpcError('Unsupported non-proxied method', EIPErrorCodes.Unsupported);
    }
  }
}
