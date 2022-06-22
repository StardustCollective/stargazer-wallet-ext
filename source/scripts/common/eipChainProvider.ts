type RequestArguments = {
  readonly method: string;
  readonly params?: any[];
};

type ProviderRpcError = Error & {
  code: number;
  data?: unknown;
};
class EIPRpcError extends Error implements ProviderRpcError {
  code: number;
  data: unknown;
  constructor(message: string, code: number, data?: unknown) {
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
export { EIPChainProvider, EIPRpcError };
