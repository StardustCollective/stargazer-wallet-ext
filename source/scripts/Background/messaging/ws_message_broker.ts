import {
  AvailableChainMethod,
  AvailableChainMethods,
  AvailableWalletEvent,
  ProtocolProvider,
  StargazerEventMessage,
  StargazerRequest,
  StargazerRequestMessage,
  StargazerResponse,
  StargazerResponseMessage,
  generateUUIDv4NamespaceId,
  isStargazerRequestMessage,
} from 'scripts/common';
import { ConstellationProvider } from 'scripts/Provider/constellation';
import { EVMProvider } from 'scripts/Provider/evm';
import {
  getTabOrigin,
  isDappConnected,
  setCurrentDapp,
} from '../handlers/handleDappMessages';

export class StargazerWSMessageBroker {
  static NoResponseEmitted = Symbol('NoResponseEmitted');

  init() {
    chrome.runtime.onMessage.addListener(this.onCSWSMessage.bind(this));
  }

  async onStargazerRpcRequest(
    chainProtocol: ProtocolProvider,
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    const ChainProviders = {
      [ProtocolProvider.CONSTELLATION]: new ConstellationProvider(),
      [ProtocolProvider.ETHEREUM]: new EVMProvider(),
    };

    const chainProvider = ChainProviders[chainProtocol] ?? null;

    if (!chainProvider) {
      throw new Error('Unable to find provider for request');
    }

    let foundMethodDefinition: AvailableChainMethod = null;

    for (const methodDefinition of AvailableChainMethods) {
      if (
        methodDefinition.chain === chainProtocol &&
        methodDefinition.method === request.method
      ) {
        foundMethodDefinition = methodDefinition;
        break;
      }
    }

    if (foundMethodDefinition === null) {
      throw new Error('Unsupported method');
    }

    if (foundMethodDefinition.proxied) {
      return await chainProvider.handleProxiedRequest(request, message, sender);
    }

    return await chainProvider.handleNonProxiedRequest(request, message, sender);
  }

  async onStargazerRequest(
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    setCurrentDapp(sender.origin, sender.tab.title, sender.tab.favIconUrl);

    const { chainProtocol, request } = message.data;

    if (request.type === 'rpc') {
      StargazerWSMessageBroker.executePredicateAndSendRpcResponse(() => {
        return this.onStargazerRpcRequest(chainProtocol, request, message, sender);
      }, message);
      return true;
    }

    return false;
  }

  async onCSWSMessage(message: any, sender: chrome.runtime.MessageSender) {
    if (isStargazerRequestMessage(message)) {
      message.tabId = sender.tab.id;
      await this.onStargazerRequest(message, sender);
      return true;
    }

    return false;
  }

  static async sendEvent(
    chainProtocol: ProtocolProvider,
    eventName: AvailableWalletEvent,
    params: any[],
    origins?: string[]
  ) {
    const tabs = await chrome.tabs.query({ url: origins?.map((o) => `${o}/*`) });

    const chnId = generateUUIDv4NamespaceId('events::chnid');

    for (const tab of tabs) {
      const message: StargazerEventMessage = {
        chnId,
        tabId: tab.id,
        data: { chainProtocol, event: { name: eventName, params } },
      };

      if (!isDappConnected(getTabOrigin(tab))) {
        continue;
      }

      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (err) {
        console.error(err);
        // NOOP
      }
    }
  }

  static async sendResponse(
    response: StargazerResponse,
    requestMessage: StargazerRequestMessage
  ) {
    const message: StargazerResponseMessage = {
      chnId: requestMessage.chnId,
      tabId: requestMessage.tabId,
      data: { chainProtocol: requestMessage.data.chainProtocol, response },
    };

    chrome.tabs.sendMessage(requestMessage.tabId, message);
  }

  static async sendResponseResult(result: any, requestMessage: StargazerRequestMessage) {
    await StargazerWSMessageBroker.sendResponse({ type: 'rpc', result }, requestMessage);
  }

  static async sendResponseError(error: any, requestMessage: StargazerRequestMessage) {
    console.error('RpcRequestError', String(error), error);
    if (error instanceof Error) {
      return await StargazerWSMessageBroker.sendResponse(
        {
          type: 'rpc',
          error: {
            message: error.message,
            code: (error as any).code,
            data: (error as any).data,
          },
        },
        requestMessage
      );
    }
    return await StargazerWSMessageBroker.sendResponse(
      { type: 'rpc', error: { message: String(error) } },
      requestMessage
    );
  }

  static async executePredicateAndSendRpcResponse(
    predicate: () => any,
    requestMessage: StargazerRequestMessage
  ) {
    try {
      const result = await predicate();

      // Response will be sent by context in user interaction
      if (Object.is(result, StargazerWSMessageBroker.NoResponseEmitted)) {
        return;
      }

      await StargazerWSMessageBroker.sendResponseResult(result, requestMessage);
    } catch (e) {
      await StargazerWSMessageBroker.sendResponseError(e, requestMessage);
    }
  }
}
