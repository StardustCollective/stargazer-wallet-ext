import {
  generateNamespaceId,
  StargazerProxyEvent,
  StargazerProxyRequest,
  StargazerProxyResponse,
  StargazerEncodedProxyEvent,
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
  isCustomEvent,
} from '../common';

import { StargazerChainProviderError } from './errors';

let injectedProxyId: string = null;

const retreiveInjectedProxyId = () => {
  const scriptElem = document.querySelector('[data-stargazer-injected=injected]');
  if (!scriptElem || !(scriptElem instanceof HTMLScriptElement)) {
    throw new StargazerChainProviderError('Unable to retreive proxy id element');
  }

  if (!scriptElem.dataset.stargazerProxyId) {
    throw new StargazerChainProviderError('Unable to retreive proxy id attribute');
  }

  injectedProxyId = scriptElem.dataset.stargazerProxyId;
  scriptElem.remove();
};

const getInjectedProxyId = () => {
  if (injectedProxyId === null) {
    throw new StargazerChainProviderError('Proxy Id is not available');
  }

  return injectedProxyId;
};

const encodeProxyRequest = (request: StargazerProxyRequest, providerId: string) => {
  const reqId = generateNamespaceId('request');
  const proxyId = getInjectedProxyId();

  const encodedRequest: StargazerEncodedProxyRequest = {
    reqId,
    proxyId,
    request,
    providerId,
  };

  return encodedRequest;
};

const decodeProxyResponse = <T extends StargazerProxyResponse['type']>(
  type: T,
  event: Event
): StargazerProxyResponse & { type: T } => {
  if (!isCustomEvent(event)) {
    throw new StargazerChainProviderError('Unable to process proxy response event');
  }

  let encodedResponse: StargazerEncodedProxyResponse;
  try {
    encodedResponse = JSON.parse(event.detail);
  } catch (e) {
    throw new StargazerChainProviderError('Unable to decode proxy response data');
  }

  const response = encodedResponse.response;

  if (response.type === 'proxy') {
    throw new StargazerChainProviderError(response.error);
  }

  if (response.type !== type) {
    throw new StargazerChainProviderError('Unable to classify proxy response');
  }

  return response as StargazerProxyResponse & { type: T };
};

const decodeProxyEvent = (event: Event): StargazerProxyEvent => {
  if (!isCustomEvent(event)) {
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

export {
  retreiveInjectedProxyId,
  getInjectedProxyId,
  encodeProxyRequest,
  decodeProxyResponse,
  decodeProxyEvent,
};
