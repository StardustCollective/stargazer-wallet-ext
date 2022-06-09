import { browser, Runtime } from 'webextension-polyfill-ts';

import { DappProvider } from './dappProvider';

class DappRegistry {
  #registeredDapps: Map<string, DappProvider>;

  constructor() {
    this.#registeredDapps = new Map();

    browser.runtime.onConnect.addListener(this.onPortConnected.bind(this));
  }

  onPortConnected(port: Runtime.Port) {
    if (!port.name.startsWith('stargazer-dapp-proxy:')) {
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

    if (url.protocol !== 'https:') {
      // Deny access to non https dapps
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

  onPortDisconnected(port: Runtime.Port, dapp: DappProvider) {
    dapp.unregisterProviderPort(port);

    if (dapp.portsSize === 0) {
      // Remove the dapp from registry since there is no other provider connected
      this.#registeredDapps.delete(dapp.origin);
    }
  }
}

export { DappRegistry };
