import debugFn from 'debug';

import {
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
  StargazerEncodedProxyEvent,
} from '../common';

const debug = debugFn('Stargazer:StargazerChainProvider');

const isStargazerProxyRequest = (
  value: any,
  proxyId: string
): value is StargazerEncodedProxyRequest => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'proxyId' in value &&
    value.proxyId === proxyId
  );
};

/**
 * Transparent Requests Proxy
 *
 * Handles all interaction between the injected
 * script and the service worker.
 *
 * Each injected provider created is piped throught a different port.
 *
 * Uses a proxyId defined on initialization to validate requests origin. Not super secure but yeah.
 */
class RequestsProxy {
  #proxyId: string;
  #ports: Map<string, chrome.runtime.Port>;

  constructor(proxyId: string) {
    this.#proxyId = proxyId;
    this.#ports = new Map();
  }

  getPortByProviderId(providerId: string) {
    let port = this.#ports.get(providerId);
    if (!port) {
      port = chrome.runtime.connect({
        name: `stargazer-provider-proxy:${window.btoa(this.#proxyId)}:${providerId}`,
      });
      port.onMessage.addListener(this.onPortMessage.bind(this));
      port.onDisconnect.addListener(() => this.onPortDisconnect(providerId));
      this.#ports.set(providerId, port);
      debug('Provider port added', providerId);
    }
    return port;
  }

  listen() {
    window.addEventListener('message', this.onWindowMessage.bind(this));
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

    try {
      const port = this.getPortByProviderId(encodedRequest.providerId);
      port.postMessage(encodedRequest);
      console.log('Message Sent:', encodedRequest);
    } catch (e) {
      console.log('Message Error:', { encodedRequest, error: e });
      this.onPortResponse({
        reqId: encodedRequest.reqId,
        providerId: encodedRequest.providerId,
        proxyId: encodedRequest.proxyId,
        response: { type: 'proxy', error: String(e) },
      });
    }
  }

  onPortDisconnect(providerId: string) {
    this.#ports.delete(providerId);
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
