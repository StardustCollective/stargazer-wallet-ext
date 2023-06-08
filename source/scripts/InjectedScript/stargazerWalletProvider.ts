import { readOnlyProxy, ProtocolProvider, StargazerChain } from '../common';

import { StargazerChainProvider } from './stargazerChainProvider';
import {
  StargazerError,
  StargazerWalletProviderError,
  StargazerChainProviderError,
  StargazerChainProviderRpcError,
} from './errors';

/**
 * Client-Facing Wallet Provider
 *
 * + Generates chain providers.
 * + Provides error classes used by the providers.
 * + Provides wallet version.
 */
class StargazerWalletProvider {
  #cacheChainProviders: Map<ProtocolProvider, StargazerChainProvider>;

  constructor() {
    this.#cacheChainProviders = new Map();
  }

  get version() {
    return STARGAZER_WALLET_VERSION;
  }

  get errorTypes() {
    return {
      StargazerError,
      StargazerWalletProviderError,
      StargazerChainProviderError,
      StargazerChainProviderRpcError,
    };
  }

  getProvider(chainValue: StargazerChain) {
    if (typeof chainValue !== 'string') {
      throw new StargazerWalletProviderError('Chain value must be a string');
    }
    
    if (!chainValue) {
      throw new StargazerWalletProviderError('Chain value not provided');
    }

    const MAP_CHAIN_TO_PROTOCOL = {
      [StargazerChain.CONSTELLATION]: ProtocolProvider.CONSTELLATION,
      [StargazerChain.ETHEREUM]: ProtocolProvider.ETHEREUM,
      [StargazerChain.AVALANCHE]: ProtocolProvider.ETHEREUM,
      [StargazerChain.POLYGON]: ProtocolProvider.ETHEREUM,
      [StargazerChain.BSC]: ProtocolProvider.ETHEREUM,
    }

    const chain: ProtocolProvider = MAP_CHAIN_TO_PROTOCOL[chainValue];

    if (!Object.values(ProtocolProvider).includes(chain)) {
      throw new StargazerWalletProviderError(`Unsupported chain '${chain}'`);
    }

    let provider = this.#cacheChainProviders.get(chain);
    if (!provider) {
      provider = readOnlyProxy(new StargazerChainProvider(chain));
      this.#cacheChainProviders.set(chain, provider);
    }

    return provider;
  }
}

export { StargazerWalletProvider };
