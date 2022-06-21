import debugFn from 'debug';

import {
  RequestArguments,
  EIPChainProvider,
  StargazerChain,
  generateNamespaceId,
  StargazerProxyEvent,
  AvailableEvents,
} from '../common';

import { StargazerChainProviderProxy } from './stargazerChainProviderProxy';

const debug = debugFn('Stargazer:StargazerChainProvider');

/**
 * Client-Facing EIP provider
 *
 * EIP 1193 JS Provider
 * https://eips.ethereum.org/EIPS/eip-1193
 *
 * + Handles client RPC requests.
 * + Handles client listen events.
 */
class StargazerChainProvider extends EIPChainProvider {
  #proxy: StargazerChainProviderProxy;
  #providerId: string;
  #chain: StargazerChain;
  #listeners: Map<Function, string>;

  constructor(chain: StargazerChain) {
    super();
    this.#proxy = new StargazerChainProviderProxy(
      this,
      this.#handleListenerEvent.bind(this)
    );
    this.#providerId = generateNamespaceId('provider');
    this.#chain = chain;
    this.#listeners = new Map();
  }

  get version() {
    return STARGAZER_WALLET_VERSION;
  }

  get chain() {
    return this.#chain;
  }

  get providerId() {
    return this.#providerId;
  }

  get activated() {
    return this.#proxy.activated;
  }

  get activate() {
    return this.#proxy.activate.bind(this.#proxy);
  }

  #handleListenerEvent(event: StargazerProxyEvent) {
    for (const [listener, listenerId] of this.#listeners) {
      if (event.listenerId === listenerId) {
        listener(...event.params);
        break;
      }
    }
  }

  async request(args: RequestArguments) {
    return this.#proxy.request({
      type: 'rpc',
      method: args.method as any,
      params: args.params,
    });
  }

  async onAsync(eventName: AvailableEvents, listener: (...args: any[]) => void) {
    const listenerId = generateNamespaceId('listener');
    this.#listeners.set(listener, listenerId);

    try {
      return this.#proxy.request({
        type: 'event',
        action: 'register',
        listenerId,
        event: eventName,
      });
    } catch (e) {
      this.#listeners.delete(listener);
      debug('error:', e);
      throw e;
    }
  }

  async removeListenerAsync(
    eventName: AvailableEvents,
    listener: (...args: any[]) => void
  ) {
    const listenerId = this.#listeners.get(listener);
    if (!listenerId) {
      return false;
    }
    this.#listeners.delete(listener);

    try {
      return await this.#proxy.request({
        type: 'event',
        action: 'deregister',
        listenerId,
        event: eventName,
      });
    } catch (e) {
      this.#listeners.set(listener, listenerId);
      debug('error:', e);
      throw e;
    }
  }

  on(eventName: AvailableEvents, listener: (...args: any[]) => void): this {
    this.onAsync(eventName, listener);
    return this;
  }

  removeListener(eventName: AvailableEvents, listener: (...args: any[]) => void): this {
    this.removeListenerAsync(eventName, listener);
    return this;
  }
}

export { StargazerChainProvider };
