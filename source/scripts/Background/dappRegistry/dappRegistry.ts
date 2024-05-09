import { AvailableEvents, ProtocolProvider } from 'scripts/common';
import { DappProvider } from './dappProvider';

class DappRegistry {
  #registeredDapps: Map<string, DappProvider>;

  constructor() {
    this.#registeredDapps = new Map();

    chrome.runtime.onConnect.addListener(this.onPortConnected.bind(this));
  }

  get onlineOrigins() {
    return [...this.#registeredDapps.keys()];
  }

  onPortConnected(port: chrome.runtime.Port) {
    if (!port.name.startsWith('stargazer-provider-proxy:')) {
      // This port seems not to be a content provider proxy port
      return;
    }

    let url: URL;
    try {
      url = new URL(port.sender?.url);
    } catch (e) {
      // Each port must have a valid URL
      port.disconnect();
      return;
    }

    let registeredDapp = this.#registeredDapps.get(url.origin);

    if (!registeredDapp) {
      registeredDapp = new DappProvider(url.origin);
      this.#registeredDapps.set(url.origin, registeredDapp);
    }

    registeredDapp.registerProviderPort(port);

    port.onDisconnect.addListener(() => this.onPortDisconnected(port, registeredDapp));
  }

  onPortDisconnected(port: chrome.runtime.Port, dapp: DappProvider) {
    dapp.deregisterProviderPort(port);

    if (dapp.portsSize === 0) {
      // Remove the dapp from registry since there is no other provider connected
      this.#registeredDapps.delete(dapp.origin);
    }
  }

  sendOriginChainEvent(
    origin: '*' | string,
    chain: '*' | ProtocolProvider,
    event: AvailableEvents,
    data: any[] = []
  ) {
    if (origin === '*') {
      for (const dappProvider of this.#registeredDapps.values()) {
        dappProvider.sendEventByFilter(
          event,
          data,
          (providerChain) => chain === '*' || chain === providerChain
        );
      }
      return;
    }

    const dappProvider = this.#registeredDapps.get(origin);
    dappProvider.sendEventByFilter(
      event,
      data,
      (providerChain) => chain === '*' || chain === providerChain
    );
  }
}

export { DappRegistry };
