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
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import { EVMProvider } from 'scripts/Provider/EVMProvider';
import {
  getTabOrigin,
  isDappConnected,
  setCurrentDapp,
} from '../handlers/handleDappMessages';

export class StargazerWSMessageBroker {
  init() {
    chrome.runtime.onMessage.addListener(this.onCSWSMessage.bind(this));
  }

  async sendResponse(
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

  async executePredicateAndSendRpcResponse(
    predicate: () => any,
    requestMessage: StargazerRequestMessage
  ) {
    try {
      const result = await predicate();
      return await this.sendResponse({ type: 'rpc', result }, requestMessage);
    } catch (e) {
      console.error('RpcRequestError', String(e), e);
      if (e instanceof Error) {
        return await this.sendResponse(
          {
            type: 'rpc',
            error: { message: e.message, code: (e as any).code, data: (e as any).data },
          },
          requestMessage
        );
      }
      return await this.sendResponse(
        { type: 'rpc', error: { message: String(e) } },
        requestMessage
      );
    }
  }

  async onStargazerRpcRequest(
    chainProtocol: ProtocolProvider,
    request: StargazerRequest & { type: 'rpc' },
    sender: chrome.runtime.MessageSender
  ) {
    const ChainProviders = {
      [ProtocolProvider.CONSTELLATION]: new StargazerProvider(),
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
      return await chainProvider.handleProxiedRequest(request, sender);
    }

    return await chainProvider.handleNonProxiedRequest(request, sender);
  }

  async onStargazerRequest(
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    setCurrentDapp(sender.origin, sender.tab.title);

    const { chainProtocol, request } = message.data;

    if (request.type === 'rpc') {
      await this.executePredicateAndSendRpcResponse(() => {
        return this.onStargazerRpcRequest(chainProtocol, request, sender);
      }, message);
      return true;
    }

    return false;
  }

  async onCSWSMessage(message: any, sender: chrome.runtime.MessageSender) {
    if (isStargazerRequestMessage(message)) {
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

      chrome.tabs.sendMessage(tab.id, message);
    }
  }
}
