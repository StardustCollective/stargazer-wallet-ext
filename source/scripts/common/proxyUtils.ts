import { RequestArguments } from './eipChainProvider';
import { StargazerChain } from './chains';

type StargazerProxyEvent = {
  event: string;
  listenerId: string;
  params: any[];
};

type StargazerProxyResponse =
  | { type: 'handshake'; result: boolean }
  | { type: 'handshake'; error: string }
  | { type: 'rpc'; result: unknown }
  | { type: 'rpc'; error: { message: string; code?: number; data?: unknown } }
  | { type: 'event'; result: boolean }
  | { type: 'event'; error: string };

type StargazerProxyRequest =
  | {
      type: 'handshake';
      providerId: string;
      chain: StargazerChain;
      origin: string;
      title: string;
    }
  | { type: 'event'; event: string; listenerId: string; action: 'register' | 'deregister' }
  | { type: 'rpc'; method: RequestArguments['method']; params: RequestArguments['params'] };

type StargazerEncodedProxyEvent = {
  listenerId: string;
  proxyId: string;
  event: StargazerProxyEvent;
};

type StargazerEncodedProxyRequest = {
  reqId: string;
  proxyId: string;
  request: StargazerProxyRequest;
};

type StargazerEncodedProxyResponse = {
  reqId: string;
  proxyId: string;
  response: StargazerProxyResponse;
};

export type {
  StargazerProxyEvent,
  StargazerProxyRequest,
  StargazerProxyResponse,
  StargazerEncodedProxyEvent,
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
};
