import {
  generateNamespaceId,
  StargazerProxyEvent,
  StargazerProxyRequest,
  StargazerProxyResponse,
  StargazerEncodedProxyEvent,
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
} from '../common';

import { StargazerChainProviderError } from './errors';

const retreiveInjectedProxyId = () => {
  const scriptElem = document.querySelector('[data-stargazer-injected=injected]');
  if (!scriptElem || !(scriptElem instanceof HTMLScriptElement)) {
    throw new StargazerChainProviderError('Unable to retreive proxy id element');
  }

  if (!scriptElem.dataset.stargazerProxyId) {
    throw new StargazerChainProviderError('Unable to retreive proxy id attribute');
  }

  return scriptElem.dataset.stargazerProxyId;
};

const encodeProxyRequest = (request: StargazerProxyRequest) => {
  const reqId = generateNamespaceId('request');
  const proxyId = retreiveInjectedProxyId();

  const encodedRequest: StargazerEncodedProxyRequest = {
    reqId,
    proxyId,
    request,
  };

  return encodedRequest;
};

const decodeProxyResponse = <T extends StargazerProxyResponse['type']>(
  type: T,
  event: Event
): StargazerProxyResponse & { type: T } => {
  if (!(event instanceof CustomEvent)) {
    throw new StargazerChainProviderError('Unable to process proxy response event');
  }

  let encodedResponse: StargazerEncodedProxyResponse;
  try {
    encodedResponse = JSON.parse(event.detail);
  } catch (e) {
    throw new StargazerChainProviderError('Unable to decode proxy response data');
  }

  const response = encodedResponse.response;

  if (response.type !== type) {
    throw new StargazerChainProviderError('Unable to classify proxy response');
  }

  return response as StargazerProxyResponse & { type: T };
};

const decodeProxyEvent = (event: Event): StargazerProxyEvent => {
  if (!(event instanceof CustomEvent)) {
    throw new StargazerChainProviderError('Unable to process proxy listen event');
  }

  let encodedEvent: StargazerEncodedProxyEvent;
  try {
    encodedEvent = JSON.parse(event.detail);
  } catch (e) {
    throw new StargazerChainProviderError('Unable to decode proxy listen event data');
  }

  return encodedEvent.event;
};

export { retreiveInjectedProxyId, encodeProxyRequest, decodeProxyResponse, decodeProxyEvent };
