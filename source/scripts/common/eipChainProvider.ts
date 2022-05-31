type RequestArguments = {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
};

type ProviderRpcError = Error & {
  code: number;
  data?: unknown;
};

abstract class EIPChainProvider {
  abstract request(args: RequestArguments): Promise<unknown>;
  abstract on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  abstract removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
}

export type { RequestArguments, ProviderRpcError };
export { EIPChainProvider };
