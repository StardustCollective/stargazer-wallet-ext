import { Runtime } from 'webextension-polyfill-ts';

import type { DappProvider } from '../Background/dappRegistry';

import { StargazerProxyRequest } from './proxyUtils';

type IRpcChainRequestHandler = {
  handleProxiedRequest: (
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: Runtime.Port
  ) => Promise<any>;

  handleNonProxiedRequest: (
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: Runtime.Port
  ) => Promise<any>;
};

export type { IRpcChainRequestHandler };
