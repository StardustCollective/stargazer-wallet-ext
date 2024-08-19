type RequestArguments = {
  readonly method: string;
  readonly params?: any[];
};

enum EIPErrorCodes {
  Rejected = 4001, // The user rejected the request.
  Unauthorized = 4100, // The requested method and/or account has not been authorized by the user.
  Unsupported = 4200, // The Provider does not support the requested method.
  Disconnected = 4900, // The Provider is disconnected from all chains.
  ChainDisconnected = 4901, // The Provider is not connected to the requested chain.
}

type ProviderRpcError = Error & {
  code: EIPErrorCodes;
  data?: unknown;
};
class EIPRpcError extends Error implements ProviderRpcError {
  code: EIPErrorCodes;
  data: unknown;
  constructor(message: string, code: EIPErrorCodes, data?: unknown) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

abstract class EIPChainProvider {
  abstract request(args: RequestArguments): Promise<unknown>;
  abstract on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  abstract removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this;
}

export type { RequestArguments, ProviderRpcError };
export { EIPChainProvider, EIPRpcError, EIPErrorCodes };
