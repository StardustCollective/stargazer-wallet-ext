import { StargazerChainProvider } from './stargazerChainProvider';
import { StargazerChain, readOnlyProxy } from './utils';
import {
  StargazerError,
  StargazerWalletProviderError,
  StargazerChainProviderError,
  StargazerChainProviderRpcError,
} from './errors';

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
