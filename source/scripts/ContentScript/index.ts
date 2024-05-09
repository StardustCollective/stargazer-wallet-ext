import { generateNamespaceId } from '../common';
import { RequestsProxy } from './requestsProxy';

const initInjectedScript = () => {
  const proxyId = generateNamespaceId('proxy');
  // TODO: test Manifest V3
  const scriptSrc = chrome.runtime.getURL('js/injectedScript.bundle.js');

  /* init requests proxy */
  const requestsProxy = new RequestsProxy(proxyId);
  requestsProxy.listen();

  /* build script elem in third-party-page */
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.src = scriptSrc;
  scriptElem.dataset.stargazerInjected = 'injected';
  scriptElem.dataset.stargazerProxyId = proxyId;

  /* inject script in third-party-page */
  const container = document.head || document.documentElement;
  container.appendChild(scriptElem);
};

initInjectedScript();
