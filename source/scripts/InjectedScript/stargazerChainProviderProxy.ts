import { StargazerProxyEvent, StargazerProxyRequest, StargazerEncodedProxyRequest } from '../common';

import { encodeProxyRequest, decodeProxyResponse, decodeProxyEvent } from './utils';
import type { StargazerChainProvider } from './stargazerChainProvider';
import { StargazerChainProviderError, StargazerChainProviderRpcError } from './errors';

type AsyncEventHandlerReturnType<Handler> = Handler extends (event: Event) => Promise<infer T> ? T : never;

/**
 * Private Requests Provider Proxy
 *
 * + Proxies/handles all provider's requests.
 * + Handles activation (handshake).
 * + There is only one provider proxy per provider.
 * + Each provider must be activated independently.
 */
class StargazerChainProviderProxy {
  #activated: null | boolean;
  #provider: StargazerChainProvider;
  #providerListenerEventHandler: (event: StargazerProxyEvent) => any;
  #listeners: Map<string, (event: Event) => any>;

  constructor(provider: StargazerChainProvider, providerListenerEventHandler: (event: StargazerProxyEvent) => any) {
    this.#activated = null;
    this.#provider = provider;
    this.#providerListenerEventHandler = providerListenerEventHandler;
    this.#listeners = new Map();
  }

  get activated() {
    return this.#activated;
  }

  #addListener(type: string, listener: (event: Event) => any) {
    this.#listeners.set(type, listener);
    window.addEventListener(type, listener, { passive: true });
  }

  #removeListener(type: string) {
    const listener = this.#listeners.get(type);
    if (!listener) {
      return;
    }

    window.removeEventListener(type, listener);
  }

  #promisifiedRequestResponse<T extends (event: Event) => Promise<any>>(
    encodedRequest: StargazerEncodedProxyRequest,
    handler: T
  ): Promise<AsyncEventHandlerReturnType<T>> {
    return new Promise<AsyncEventHandlerReturnType<T>>((resolve, reject) => {
      window.addEventListener(
        encodedRequest.reqId,
        async (event) => {
          try {
            resolve(await handler(event));
          } catch (e) {
            reject(e);
          }
        },
        { once: true, passive: true }
      );

      window.postMessage(encodedRequest, '*');
    });
  }

  async #handlePromisifiedRequestResponse<T extends (event: Event) => Promise<any>>(
    request: StargazerProxyRequest,
    handler: T
  ) {
    const encodedRequest = encodeProxyRequest(request);
    return this.#promisifiedRequestResponse(encodedRequest, handler);
  }

  async #handleHandshakeResponse(event: Event) {
    const response = decodeProxyResponse('handshake', event);

    if ('error' in response) {
      throw new StargazerChainProviderError(response.error);
    }

    return response.result;
  }

  async #handleRpcResponse(event: Event) {
    const response = decodeProxyResponse('rpc', event);

    if ('error' in response) {
      if ('code' in response.error && 'data' in response.error) {
        throw new StargazerChainProviderRpcError(response.error.code, response.error.data, response.error.message);
      }

      throw new StargazerChainProviderError(response.error.message);
    }

    return response.result;
  }

  async #handleEventRequest(request: StargazerProxyRequest & { type: 'event' }) {
    const encodedRequest = encodeProxyRequest(request);

    if (request.action === 'register') {
      this.#addListener(request.listenerId, this.#handleListenerEvent.bind(this));
    }

    if (request.action === 'deregister') {
      this.#removeListener(request.listenerId);
    }

    return this.#promisifiedRequestResponse(encodedRequest, this.#handleEventResponse.bind(this));
  }

  async #handleEventResponse(event: Event) {
    const response = decodeProxyResponse('event', event);

    if ('error' in response) {
      throw new StargazerChainProviderError(response.error);
    }

    return response.result;
  }

  async #handleListenerEvent(event: Event) {
    const listenerEvent = decodeProxyEvent(event);

    this.#providerListenerEventHandler(listenerEvent);
  }

  async activate(title?: string) {
    const request: StargazerProxyRequest = {
      type: 'handshake',
      providerId: this.#provider.providerId,
      chain: this.#provider.chain,
      origin: location.origin,
      title: title ?? document.title,
    };

    const result = await this.#handlePromisifiedRequestResponse(request, this.#handleHandshakeResponse);
    this.#activated = result;
    return result;
  }

  async request(request: StargazerProxyRequest): Promise<any> {
    if (this.#activated === null) {
      await this.activate();
    }

    if (this.#activated === false) {
      throw new StargazerChainProviderError('User denied provider activation');
    }

    if (request.type === 'rpc') {
      return this.#handlePromisifiedRequestResponse(request, this.#handleRpcResponse);
    }

    if (request.type === 'event') {
      return this.#handleEventRequest(request);
    }

    throw new StargazerChainProviderError('Unable to classify proxy request');
  }
}

export { StargazerChainProviderProxy };
