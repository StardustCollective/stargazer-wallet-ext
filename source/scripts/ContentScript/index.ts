import { browser } from 'webextension-polyfill-ts';

import { generateNamespaceId } from '../common';

import { StargazerRequestsProxy } from './stargazerRequestsProxy';

const initInjectedScript = () => {
  const proxyId = generateNamespaceId('proxy');

  /* init requests proxy */
  const requestsProxy = new StargazerRequestsProxy(proxyId);
  requestsProxy.listen();

  /* inject script in third-party-page */
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.src = browser.runtime.getURL('js/injectedScript.bundle.js');
  scriptElem.dataset.stargazerInjected = 'injected';
  scriptElem.dataset.stargazerProxyId = proxyId;
  document.body.appendChild(scriptElem);
};

document.addEventListener('DOMContentLoaded', initInjectedScript);
