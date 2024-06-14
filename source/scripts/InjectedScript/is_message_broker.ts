import {
  isCustomEvent,
  StargazerMessageEventName,
  isStargazerBaseMessage,
  isStargazerEventMessage,
  StargazerEventListener,
  AvailableWalletEvent,
  isStargazerResponseMessage,
  StargazerBaseMessage,
  StargazerEventMessage,
  StargazerResponseMessage,
  RequestArguments,
  StargazerRequestMessage,
  generateUUIDv4NamespaceId,
  AvailableMethods,
  ProtocolProvider,
} from '../common';

import { StargazerChainProviderError, StargazerChainProviderRpcError } from './errors';

export type StargazerEventsListener = StargazerEventListener<
  [AvailableWalletEvent, any[]]
>;

export class StargazerISMessageBroker {
  #eventsListeners = new Map<StargazerEventsListener, ProtocolProvider>();
  #pendingResponses = new Map<
    StargazerBaseMessage['chnId'],
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
    }
  >();

  init() {
    window.addEventListener(
      StargazerMessageEventName.CS_IS_MESSAGE,
      this.onCSISMessage.bind(this)
    );
  }

  registerEventsListener(
    chainProtocol: ProtocolProvider,
    listener: StargazerEventsListener
  ) {
    this.#eventsListeners.set(listener, chainProtocol);
  }

  doRpcRequest(chainProtocol: ProtocolProvider, args: RequestArguments) {
    return new Promise((resolve, reject) => {
      const message: StargazerRequestMessage = {
        chnId: generateUUIDv4NamespaceId('rpc::chnid'),
        tabId: -1,
        data: {
          chainProtocol,
          request: {
            type: 'rpc',
            method: args.method as AvailableMethods,
            params: args.params,
          },
        },
      };

      this.#pendingResponses.set(message.chnId, { resolve, reject });

      window.addEventListener(message.chnId, this.onCSISMessage.bind(this), {
        once: true,
        passive: true,
      });

      window.dispatchEvent(
        new CustomEvent(StargazerMessageEventName.IS_CS_MESSAGE, {
          detail: message,
        })
      );
    });
  }

  onStargazerEvent(message: StargazerEventMessage) {
    for (const [listener, chainProtocol] of this.#eventsListeners.entries()) {
      if (message.data.chainProtocol !== chainProtocol) {
        continue;
      }

      listener(message.data.event.name, message.data.event.params);
    }
  }

  onStargazerResponse(message: StargazerResponseMessage) {
    const { response } = message.data;

    if (response.type === 'rpc') {
      const responseHandler = this.#pendingResponses.get(message.chnId);
      if (!responseHandler) {
        // NOOP
        return false;
      }

      if ('error' in response) {
        if ('code' in response.error && 'data' in response.error) {
          responseHandler.reject(
            new StargazerChainProviderRpcError(
              response.error.code,
              response.error.data,
              response.error.message
            )
          );
        }

        responseHandler.reject(new StargazerChainProviderError(response.error.message));
        return true;
      }

      if ('result' in response) {
        responseHandler.resolve(response.result);
        return true;
      }

      this.#pendingResponses.delete(message.chnId);

      return false;
    }

    return false;
  }

  onCSISMessage(event: Event) {
    if (!isCustomEvent(event)) {
      // NOOP
      return false;
    }

    if (!isStargazerBaseMessage(event.detail)) {
      // NOOP
      return false;
    }

    const message = event.detail;

    if (isStargazerEventMessage(message)) {
      this.onStargazerEvent(message);
      return true;
    }

    if (isStargazerResponseMessage(message)) {
      this.onStargazerResponse(message);
      return true;
    }

    return false;
  }
}
