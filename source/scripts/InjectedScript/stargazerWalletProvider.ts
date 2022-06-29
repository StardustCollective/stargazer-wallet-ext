import { readOnlyProxy, StargazerChain } from '../common';

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
  #cacheChainProviders: Map<StargazerChain, StargazerChainProvider>;

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

  getProvider(chain: StargazerChain) {
    if (!Object.values(StargazerChain).includes(chain)) {
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
