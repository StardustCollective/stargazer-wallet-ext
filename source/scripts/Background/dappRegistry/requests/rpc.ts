import {
  AvailableChainMethods,
  AvailableChainMethod,
  ProtocolProvider,
} from '../../../common';

import type { DappProviderExternalImplementation } from '../dappProvider';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import { EVMProvider } from 'scripts/Provider/EVMProvider';

/**
 * Extended implementation of DappProvider.onRpcRequest
 */
const handleRpcRequest: DappProviderExternalImplementation<'onRpcRequest', []> = async (
  dappProvider,
  port,
  request,
  _encodedRequest
) => {
  const CHAIN_PROVIDERS = {
    [ProtocolProvider.CONSTELLATION]: new StargazerProvider(),
    [ProtocolProvider.ETHEREUM]: new EVMProvider(),
  };

  const { chain } = dappProvider.getChainProviderDataByPort(port);
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
