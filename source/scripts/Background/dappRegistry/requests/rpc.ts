import {
  AvailableChainMethods,
  AvailableChainMethod,
  ProtocolProvider,
} from '../../../common';

import type { DappProviderExternalImplementation } from '../dappProvider';

/**
 * Extended implementation of DappProvider.onRpcRequest
 */
const handleRpcRequest: DappProviderExternalImplementation<'onRpcRequest', []> = async (
  dappProvider,
  port,
  request,
  _encodedRequest
) => {
  if (!window.controller.wallet.isUnlocked()) {
    throw new Error('Wallet must be unlocked');
  }

  const CHAIN_PROVIDERS = {
    [ProtocolProvider.CONSTELLATION]: window.controller.stargazerProvider,
    [ProtocolProvider.ETHEREUM]: window.controller.ethereumProvider,
  };

  const chain = dappProvider.getChainProviderDataByPort(port).chain;
  const chainProvider = CHAIN_PROVIDERS[chain] ?? null;

  if (!chainProvider) {
    throw new Error('Unable to find provider for request');
  }

  let foundMethodDefinition: AvailableChainMethod = null;

  for (const methodDefinition of AvailableChainMethods) {
    if (methodDefinition.chain === chain && methodDefinition.method === request.method) {
      foundMethodDefinition = methodDefinition;
      break;
    }
  }

  if (foundMethodDefinition === null) {
    throw new Error('Unsupported method');
  }

  let result: any;
  if (foundMethodDefinition.proxied) {
    result = await chainProvider.handleProxiedRequest(request, dappProvider, port);
  } else {
    result = await chainProvider.handleNonProxiedRequest(request, dappProvider, port);
  }

  return { type: 'rpc', result };
};

export { handleRpcRequest };
