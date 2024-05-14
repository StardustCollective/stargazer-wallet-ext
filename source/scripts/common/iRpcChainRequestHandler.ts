import { StargazerRequest } from './message_broker_utils';

type IRpcChainRequestHandler = {
  handleProxiedRequest: (
    request: StargazerRequest & { type: 'rpc' },
    sender: chrome.runtime.MessageSender
  ) => Promise<any>;

  handleNonProxiedRequest: (
    request: StargazerRequest & { type: 'rpc' },
    sender: chrome.runtime.MessageSender
  ) => Promise<any>;
};

export type { IRpcChainRequestHandler };
