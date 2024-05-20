import { ProtocolProvider, StargazerChain, readOnlyProxy } from 'scripts/common';
import { StargazerChainProvider } from './chain_provider';
import {
  StargazerError,
  StargazerWalletProviderError,
  StargazerChainProviderError,
  StargazerChainProviderRpcError,
} from './errors';
import { StargazerISMessageBroker } from './is_message_broker';

const ChainProviderProtocol: Record<StargazerChain, ProtocolProvider> = {
  [StargazerChain.CONSTELLATION]: ProtocolProvider.CONSTELLATION,
  [StargazerChain.ETHEREUM]: ProtocolProvider.ETHEREUM,
  [StargazerChain.AVALANCHE]: ProtocolProvider.ETHEREUM,
  [StargazerChain.BSC]: ProtocolProvider.ETHEREUM,
  [StargazerChain.POLYGON]: ProtocolProvider.ETHEREUM,
};

export class StargazerWalletProvider {
  #broker: StargazerISMessageBroker;
  #createdProviders = new Map<ProtocolProvider, StargazerChainProvider>();

  constructor(broker: StargazerISMessageBroker) {
    this.#broker = broker;
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
    if (typeof chain !== 'string') {
      throw new StargazerWalletProviderError('Chain value must be a string');
    }

    if (!chain) {
      throw new StargazerWalletProviderError('Chain value not provided');
    }

    if (!Object.keys(ChainProviderProtocol).includes(chain)) {
      throw new StargazerWalletProviderError(`Unsupported chain '${chain}'`);
    }

    const protocol = ChainProviderProtocol[chain];

    let provider = this.#createdProviders.get(protocol);

    if (!provider) {
      provider = readOnlyProxy(new StargazerChainProvider(protocol, this.#broker));
      this.#createdProviders.set(protocol, provider);
    }

    return provider;
  }
}
