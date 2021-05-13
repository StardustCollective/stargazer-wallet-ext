import { browser } from 'webextension-polyfill-ts';

//For security only messages in JSON string messages will be passed to the application
const isJSON = (json: any) => {
  if (Object.prototype.toString.call(json) !== '[object String]') return false;
  try {
    return JSON.parse(json);
  } catch (e) {
    return false;
  }
};

const getWalletInfo = () => {
  browser.runtime.sendMessage({ type: 'getWalletInfo' }, (response: any) => {
    if (!browser.runtime.lastError || response !== 'ok') {
      document.dispatchEvent(
        new CustomEvent('stargazerWalletInfo', { detail: response })
      );
    }
  });
};

document.addEventListener('stargazerWalletInfo', () => getWalletInfo());

const stargazerWalletConnect = (detail: any) => {
  browser.runtime
    .sendMessage({ type: 'stargazerWalletConnect', data: detail })
    .then((response: any) => {
      console.log(response);
      if (!browser.runtime.lastError && response !== 'ok') {
        // document.dispatchEvent(
        //   new CustomEvent('stargazerWalletInfo', { detail: response })
        // );
      }
    });
};

document.addEventListener('stargazerWalletConnect', (event: any) => {
  const detail = event.detail;
  // //If a detail value was passed validate it is a JSON string.  If not then pass back an error to the webpage
  if (isJSON(detail)) stargazerWalletConnect(detail);
  else {
    const errors = ['Expected event detail to be JSON string'];
    document.dispatchEvent(
      new CustomEvent('stargazerWalletInfo', { detail: { errors } })
    );
    return;
  }
});

export {};
