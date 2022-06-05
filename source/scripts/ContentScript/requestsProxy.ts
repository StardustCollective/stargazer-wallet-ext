import { browser, Runtime } from 'webextension-polyfill-ts';

import { StargazerEncodedProxyRequest, StargazerEncodedProxyResponse, StargazerEncodedProxyEvent } from '../common';

const isStargazerProxyRequest = (value: any, proxyId: string): value is StargazerEncodedProxyRequest => {
  return 'proxyId' in value && value.proxyId === proxyId;
};

/**
 * Transparent Requests Proxy
 *
 * Handles all interaction between the injected
 * script and the background script.
 *
 * Uses a proxyId defined on initialization to validate requests origin. Not super secure but yeah.
 */
class RequestsProxy {
  #proxyId: string;
  #requestsPort: Runtime.Port;
  #eventsPort: Runtime.Port;

  constructor(proxyId: string) {
    this.#proxyId = proxyId;
    this.#requestsPort = browser.runtime.connect(undefined, { name: `stargazer-requests:${window.btoa(proxyId)}` });
    this.#eventsPort = browser.runtime.connect(undefined, { name: `stargazer-events:${window.btoa(proxyId)}` });
  }

  listen() {
    window.addEventListener('message', this.onWindowMessage.bind(this));
    this.#requestsPort.onMessage.addListener(this.onPortResponse.bind(this));
    this.#eventsPort.onMessage.addListener(this.onPortEvent.bind(this));
  }

  onWindowMessage(event: MessageEvent<unknown>) {
    if (event.source !== window) {
      // NOOP
      return;
    }

    const encodedRequest = event.data;
    if (!isStargazerProxyRequest(encodedRequest, this.#proxyId)) {
      // NOOP
      return;
    }

    this.#requestsPort.postMessage(encodedRequest);
  }

  onPortResponse(encodedResponse: StargazerEncodedProxyResponse) {
    if (encodedResponse.proxyId !== this.#proxyId) {
      throw new Error('Unmatched proxy id on port response');
    }

    window.dispatchEvent(new CustomEvent(encodedResponse.reqId, { detail: JSON.stringify(encodedResponse) }));
  }

  onPortEvent(encodedEvent: StargazerEncodedProxyEvent) {
    if (encodedEvent.proxyId !== this.#proxyId) {
      throw new Error('Unmatched proxy id on port event');
    }

    window.dispatchEvent(new CustomEvent(encodedEvent.listenerId, { detail: JSON.stringify(encodedEvent) }));
  }
}

export { RequestsProxy };
