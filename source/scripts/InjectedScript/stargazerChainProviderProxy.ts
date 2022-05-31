import {
  StargazerEncodedProxyRequest,
  StargazerProxyRequest,
  StargazerEncodedProxyResponse,
  StargazerProxyResponse,
} from '../common/proxy-types';

import { StargazerChainProviderError, StargazerChainProviderRpcError } from './errors';
import { genProxyReqId } from './utils';

class StargazerChainProviderProxy {
  retreiveProxyOnce() {
    const scriptElem = document.querySelector('[data-stargazer-injected=injected]');
    if (!scriptElem || !(scriptElem instanceof HTMLScriptElement)) {
      throw new StargazerChainProviderError('Unable to retreive proxy once element');
    }

    if (!scriptElem.dataset.stargazerOnce) {
      throw new StargazerChainProviderError('Unable to retreive proxy once attribute');
    }

    return scriptElem.dataset.stargazerOnce;
  }

  request<T = any>(request: StargazerProxyRequest): Promise<T> {
    return new Promise<T>((rs, rj) => {
      const reqId = genProxyReqId();

      window.addEventListener(
        reqId,
        (event) => {
          if (!(event instanceof CustomEvent)) {
            rj(new StargazerChainProviderError('Unable to process proxy response event'));
            return;
          }

          let encodedResponse: StargazerEncodedProxyResponse;
          try {
            encodedResponse = JSON.parse(event.detail);
          } catch (e) {
            rj(new StargazerChainProviderError('Unable to decode proxy response data'));
            return;
          }

          const response: StargazerProxyResponse = encodedResponse.response;

          if (response.type === 'error' && response.error.type === 'general') {
            rj(new StargazerChainProviderError(response.error.message));
            return;
          }

          if (response.type === 'error' && response.error.type === 'rpc') {
            rj(new StargazerChainProviderRpcError(response.error.code, response.error.data, response.error.message));
            return;
          }

          if (response.type === 'response') {
            rs(response.data as T);
          }

          rj(new StargazerChainProviderError('Unable to classify proxy response'));
        },
        { once: true, passive: true }
      );

      let once: string;
      try {
        once = this.retreiveProxyOnce();
      } catch (e) {
        rj(e);
        return;
      }

      const encodedRequest: StargazerEncodedProxyRequest = {
        reqId,
        once,
        request,
      };

      window.postMessage(encodedRequest, '*');
    });
  }
}

export { StargazerChainProviderProxy };
