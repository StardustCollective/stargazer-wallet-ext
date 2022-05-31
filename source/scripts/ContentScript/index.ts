import { browser } from 'webextension-polyfill-ts';
import { StargazerRequestsProxy } from './stargazerRequestsProxy';

const genStargazerProxyOnce = () => `stargazer:${window.btoa(`${Date.now()}:${Math.random()}`)}`;

const initInjectedScript = () => {
  const proxyOnce = genStargazerProxyOnce();

  /* init requests proxy */
  const requestsProxy = new StargazerRequestsProxy(proxyOnce);
  requestsProxy.listen();

  /* inject script in third-party-page */
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.src = browser.runtime.getURL('js/injectedScript.bundle.js');
  scriptElem.dataset.stargazerInjected = 'injected';
  scriptElem.dataset.stargazerOnce = proxyOnce;
  document.body.appendChild(scriptElem);
};

document.addEventListener('DOMContentLoaded', initInjectedScript);
