import {
  AvailableMethods,
  AvailableWalletEvent,
  EIPChainProvider,
  ProtocolProvider,
  RequestArguments,
  StargazerEventListener,
} from 'scripts/common';
import { StargazerISMessageBroker } from './is_message_broker';

/**
 * Client-Facing EIP provider
 *
 * EIP 1193 JS Provider
 * https://eips.ethereum.org/EIPS/eip-1193
 *
 * + Handles client RPC requests.
 * + Handles client listen events.
 */
export class StargazerChainProvider extends EIPChainProvider {
  #listeners = new Map<AvailableWalletEvent, Set<StargazerEventListener>>();
  #chain: ProtocolProvider;
  #broker: StargazerISMessageBroker;

  constructor(chain: ProtocolProvider, broker: StargazerISMessageBroker) {
    super();
    this.#chain = chain;
    this.#broker = broker;

    this.#broker.registerEventsListener(chain, this.#onAvailableWalletEvent.bind(this));
  }

  get version() {
    return STARGAZER_WALLET_VERSION;
  }

  /**
   * @deprecated since manifest version v3, providers are now identified by requesting origin and wallet protocol
   */
  get providerId() {
    return '';
  }

  get chain() {
    return this.#chain;
  }

  /**
   * @deprecated since manifest version v3, providers connect directly to the extension, no need to be activated
   * authorization on the other hand is handled by the rpc methods *_requestAccounts
   */
  get activated() {
    return true;
  }

  /**
   * @deprecated since manifest version v3, providers connect directly to the extension, no need to be activated
   * authorization on the other hand is handled by the rpc methods *_requestAccounts
   */
  activate() {
    return this.request({
      method:
        this.chain === ProtocolProvider.ETHEREUM
          ? AvailableMethods.eth_requestAccounts
          : AvailableMethods.dag_requestAccounts,
      params: [],
    });
  }

  #getEventListeners(eventName: AvailableWalletEvent) {
    let eventListeners = this.#listeners.get(eventName);
    if (!eventListeners) {
      eventListeners = new Set();
      this.#listeners.set(eventName, eventListeners);
    }
    return eventListeners;
  }

  #onAvailableWalletEvent(eventName: AvailableWalletEvent, params: any[]) {
    const eventListeners = this.#getEventListeners(eventName);
    for (const listener of eventListeners) {
      listener(...params);
    }
  }

  request(args: RequestArguments): Promise<unknown> {
    return this.#broker.doRpcRequest(this.chain, args);
  }

  on(eventName: AvailableWalletEvent, listener: (...args: any[]) => void): this {
    const eventListeners = this.#getEventListeners(eventName);
    eventListeners.add(listener);
    return this;
  }

  removeListener(
    eventName: AvailableWalletEvent,
    listener: (...args: any[]) => void
  ): this {
    const eventListeners = this.#getEventListeners(eventName);
    eventListeners.delete(listener);
    return this;
  }

  /**
   * @deprecated since manifest version v3, use StargazerChainProvider.on()
   */
  async onAsync(eventName: AvailableWalletEvent, listener: (...args: any[]) => void) {
    this.on(eventName, listener);
  }

  /**
   * @deprecated since manifest version v3, use StargazerChainProvider.removeListener()
   */
  async removeListenerAsync(
    eventName: AvailableWalletEvent,
    listener: (...args: any[]) => void
  ) {
    this.removeListener(eventName, listener);
  }
}
