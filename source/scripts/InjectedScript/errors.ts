import { ProviderRpcError } from '../common/eipChainProvider';

class StargazerError extends Error {}

class StargazerWalletProviderError extends StargazerError {}

class StargazerChainProviderError extends StargazerError {}

class StargazerChainProviderRpcError
  extends StargazerChainProviderError
  implements ProviderRpcError
{
  code: number;
  data?: unknown;

  constructor(code: number, data: unknown, message?: string) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export {
  StargazerError,
  StargazerWalletProviderError,
  StargazerChainProviderError,
  StargazerChainProviderRpcError,
};
