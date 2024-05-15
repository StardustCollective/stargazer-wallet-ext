import { StargazerRequest, StargazerRequestMessage } from './message_broker_utils';

type IRpcChainRequestHandler = {
  handleProxiedRequest: (
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) => Promise<any>;

  handleNonProxiedRequest: (
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) => Promise<any>;
};

export type { IRpcChainRequestHandler };
