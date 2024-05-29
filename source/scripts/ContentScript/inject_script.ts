import { StargazerCSMessageBroker } from './cs_message_broker';

export const injectScript = () => {
  const scriptSrc = chrome.runtime.getURL('js/injectedScript.bundle.js');

  /* init requests proxy */
  const broker = new StargazerCSMessageBroker();
  broker.init();

  /* build script elem in third-party-page */
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.src = scriptSrc;

  /* inject script in third-party-page */
  const container = document.head || document.documentElement;
  container.appendChild(scriptElem);
};
