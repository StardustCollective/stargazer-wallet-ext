import { browser } from 'webextension-polyfill-ts';

import { generateNamespaceId } from '../common';

import { RequestsProxy } from './requestsProxy';

const initInjectedScript = () => {
  const proxyId = generateNamespaceId('proxy');
  const scriptSrc = browser.runtime.getURL('js/injectedScript.bundle.js');

  /* init requests proxy */
  const requestsProxy = new RequestsProxy(proxyId);
  requestsProxy.listen();

  /* fetch script contents (MV2) */
  const scriptContentXHR = new XMLHttpRequest();
  scriptContentXHR.open('get', scriptSrc, false);
  scriptContentXHR.send();

  /* build script content */
  const scriptContent = [
    scriptContentXHR.responseText,
    `//# sourceURL=${scriptSrc}`,
  ].join('\n');

  /* build script elem in third-party-page */
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.textContent = scriptContent;
  scriptElem.dataset.stargazerInjected = 'injected';
  scriptElem.dataset.stargazerProxyId = proxyId;

  /* inject script in third-party-page */
  const container = document.head || document.documentElement;
  container.insertBefore(scriptElem, container.children[0]);
};

initInjectedScript();
