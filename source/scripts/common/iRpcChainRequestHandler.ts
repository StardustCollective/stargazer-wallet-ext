import type { DappProvider } from '../Background/dappRegistry';

import { StargazerProxyRequest } from './proxyUtils';

type IRpcChainRequestHandler = {
  handleProxiedRequest: (
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: chrome.runtime.Port
  ) => Promise<any>;

  handleNonProxiedRequest: (
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: chrome.runtime.Port
  ) => Promise<any>;
};

export type { IRpcChainRequestHandler };
