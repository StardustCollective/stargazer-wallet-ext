import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';

export const messagesHandler = (masterController: IMasterController) => {
  const fromApp = (url: string) => {
    return url.startsWith(`${window.location.origin}/app.html`);
  };
  const fromConfirm = (url: string) => {
    return url.startsWith(`${window.location.origin}/confirm.html`);
  };

  browser.runtime.onMessage.addListener(
    (message: any, sender: Runtime.MessageSender) => {
      if (browser.runtime.lastError)
        return Promise.reject('Runtime Last Error');

      const sendErrors = (errors: any[]) => Promise.resolve({ errors });
      // const isFromAuthorizedDapp = masterController.fromAuthorizedDapp(
      //   sender.origin
      // );
      // const dappInfo = isFromAuthorizedDapp
      //   ? masterController.dapps.getDappInfoByURL(sender.origin)
      //   : undefined;
      const isFromApp = fromApp(sender.url);
      const isFromConfirm = fromConfirm(sender.url);
      const walletIsLocked = masterController.wallet.isLocked();
      if (message.type === 'stargazerWalletConnect') {
        if (walletIsLocked) {
          return sendErrors(['Wallet is Locked']);
        }
        masterController.createPopup(uuid());
        return Promise.resolve({ response: '🚀 Connection Request!' });
      }
      return Promise.resolve({ response: 'Hi from content script' });
    }
  );
};
