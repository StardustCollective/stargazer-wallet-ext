import { browser, Runtime } from 'webextension-polyfill-ts';
import {
  StargazerEncodedProxyRequest,
  StargazerProxyRequest,
  StargazerEncodedProxyResponse,
  StargazerProxyResponse,
} from '../common/proxy-types';

const isStargazerProxyRequest = (value: any, once: string): value is StargazerEncodedProxyRequest => {
  return 'once' in value && value.once === once;
};

class StargazerRequestsProxy {
  #once: string;
  #port: Runtime.Port;

  constructor(once: string) {
    this.#once = once;
    this.#port = browser.runtime.connect(undefined, { name: 'stargazer' });
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
    if (!isStargazerProxyRequest(encodedRequest, this.#once)) {
      // NOOP
      return;
    }
  }

  onPortMessage(event: { id: string; data: string }) {}
}

export { StargazerRequestsProxy };
