import { AvailableEvents } from './availableEvents';
import { AvailableMethods } from './availableMethods';
import { RequestArguments } from './eipChainProvider';
import { ProtocolProvider } from './chains';

type StargazerProxyEvent = {
  event: AvailableEvents;
  listenerId: string;
  params: any[];
};

type StargazerProxyResponse =
  | { type: 'proxy'; error: string }
  | { type: 'handshake'; result: boolean }
  | { type: 'handshake'; error: string }
  | { type: 'rpc'; result: unknown }
  | { type: 'rpc'; error: { message: string; code?: number; data?: unknown } }
  | { type: 'event'; result: boolean }
  | { type: 'event'; error: string }
  | { type: 'import'; result: boolean }
  | { type: 'import'; error: string };

type StargazerProxyRequest =
  | {
      type: 'handshake';
      chain: ProtocolProvider;
      title: string;
    }
  | {
      type: 'event';
      event: AvailableEvents;
      listenerId: string;
      action: 'register' | 'deregister';
    }
  | {
      type: 'rpc';
      method: RequestArguments['method'] & AvailableMethods;
      params: RequestArguments['params'];
    }
  | { type: 'import'; provider: 'ledger'; addresses: any[] };

type StargazerEncodedProxyEvent = {
  listenerId: string;
  proxyId: string;
  providerId: string;
  event: StargazerProxyEvent;
};

type StargazerEncodedProxyRequest = {
  reqId: string;
  proxyId: string;
  providerId: string;
  request: StargazerProxyRequest;
};

type StargazerEncodedProxyResponse = {
  reqId: string;
  proxyId: string;
  providerId: string;
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
