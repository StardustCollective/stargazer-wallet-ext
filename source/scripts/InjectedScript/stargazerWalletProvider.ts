import {readOnlyProxy, StargazerChain} from '../common'

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

    return readOnlyProxy(new StargazerChainProvider(chain));
  }
}

export { StargazerWalletProvider };
