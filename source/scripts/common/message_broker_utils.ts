import { AvailableWalletEvent } from './availableEvents';
import { AvailableMethods } from './availableMethods';
import { ProtocolProvider } from './chains';
import { RequestArguments } from './eipChainProvider';

export enum StargazerMessageEventName {
  CS_IS_MESSAGE = 'StargazerMessages::CSIS',
  IS_CS_MESSAGE = 'StargazerMessages::ISCS',
}

export type StargazerEventListener<Args extends any[] = any[]> = (...args: Args) => any;

export type StargazerEvent = {
  name: AvailableWalletEvent;
  params: any[];
};

export type StargazerResponse =
  | { type: 'rpc'; result: unknown }
  | { type: 'rpc'; error: { message: string; code?: number; data?: unknown } }
  | { type: 'import'; result: boolean }
  | { type: 'import'; error: string };

export type StargazerRequest =
  | {
      type: 'rpc';
      method: RequestArguments['method'] & AvailableMethods;
      params: RequestArguments['params'];
    }
  | { type: 'import'; provider: 'ledger'; addresses: any[] };

export type StargazerBaseMessage<D extends Record<any, any> = Record<any, any>> = {
  chnId: string;
  tabId: number;
  data: D;
};

export type StargazerEventMessage = StargazerBaseMessage<{
  chainProtocol: ProtocolProvider;
  event: StargazerEvent;
}>;

export type StargazerRequestMessage = StargazerBaseMessage<{
  chainProtocol: ProtocolProvider;
  request: StargazerRequest;
}>;

export type StargazerResponseMessage = StargazerBaseMessage<{
  chainProtocol: ProtocolProvider;
  response: StargazerResponse;
}>;

export const isStargazerBaseMessage = (
  value: any
): value is StargazerBaseMessage<Record<any, any>> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'chnId' in value &&
    typeof value.chnId === 'string' &&
    'tabId' in value &&
    typeof value.tabId === 'number' &&
    'data' in value &&
    typeof value.data === 'object' &&
    value.data !== null
  );
};

export const isStargazerEventMessage = (value: any): value is StargazerEventMessage => {
  return (
    isStargazerBaseMessage(value) &&
    'event' in value.data &&
    typeof value.data.event === 'object' &&
    value.data.event !== null
  );
};

export const isStargazerRequestMessage = (
  value: any
): value is StargazerRequestMessage => {
  return (
    isStargazerBaseMessage(value) &&
    'request' in value.data &&
    typeof value.data.request === 'object' &&
    value.data.request !== null
  );
};

export const isStargazerResponseMessage = (
  value: any
): value is StargazerResponseMessage => {
  return (
    isStargazerBaseMessage(value) &&
    'response' in value.data &&
    typeof value.data.response === 'object' &&
    value.data.response !== null
  );
};
