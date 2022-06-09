import { browser, Runtime } from 'webextension-polyfill-ts';

import {
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
  StargazerEncodedProxyEvent,
} from '../common';

const isStargazerProxyRequest = (
  value: any,
  proxyId: string
): value is StargazerEncodedProxyRequest => {
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
  #port: Runtime.Port;

  constructor(proxyId: string) {
    this.#proxyId = proxyId;
    this.#port = browser.runtime.connect(undefined, {
      name: `stargazer-dapp-proxy:${window.btoa(proxyId)}`,
    });
  }

  listen() {
    window.addEventListener('message', this.onWindowMessage.bind(this));
    this.#port.onMessage.addListener(this.onPortMessage.bind(this));
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

    this.#port.postMessage(encodedRequest);
  }

  onPortMessage(encoded: StargazerEncodedProxyResponse | StargazerEncodedProxyEvent) {
    if ('listenerId' in encoded) {
      this.onPortEvent(encoded);
      return;
    }

    if ('reqId' in encoded) {
      this.onPortResponse(encoded);
      return;
    }

    throw new Error('Unable to classify port message');
  }

  onPortResponse(encodedResponse: StargazerEncodedProxyResponse) {
    if (encodedResponse.proxyId !== this.#proxyId) {
      throw new Error('Unmatched proxy id on port response');
    }

    window.dispatchEvent(
      new CustomEvent(encodedResponse.reqId, { detail: JSON.stringify(encodedResponse) })
    );
  }

  onPortEvent(encodedEvent: StargazerEncodedProxyEvent) {
    if (encodedEvent.proxyId !== this.#proxyId) {
      throw new Error('Unmatched proxy id on port event');
    }

    window.dispatchEvent(
      new CustomEvent(encodedEvent.listenerId, { detail: JSON.stringify(encodedEvent) })
    );
  }
}

export { RequestsProxy };
