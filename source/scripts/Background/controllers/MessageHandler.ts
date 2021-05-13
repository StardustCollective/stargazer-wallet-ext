import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';

export const messagesHandler = (port: Runtime.Port, masterController: IMasterController) => {
  console.log('messagesHandler.HELLO');

  const fromApp = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/app.html`);
  };
  const fromConfirm = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/confirm.html`);
  };

  const listener = async (message: any) => {
    try {
      const { id, result } = await listenerHandler(message);
      console.log('messagesHandler.RESPONSE');
      console.log(JSON.stringify(result,null,2));
      port.postMessage({id, data: { result }})
    }
    catch (e) {
      console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      console.log(JSON.stringify(e,null,2));
      port.postMessage({id: e.type, data: { error: e.detail}})
    }
  }

  const listenerHandler = async (message: {id: string, type: string, data: { asset: string, method: string, args: any[]}}) => {
    if (browser.runtime.lastError)
      return Promise.reject('Runtime Last Error');

    console.log('messagesHandler.onMessage: ' + port.sender?.url);

    const sendError = (error: string) => Promise.reject(new CustomEvent(message.id, {detail: error}));
    // const isFromAuthorizedDapp = masterController.fromAuthorizedDapp(
    //   sender.origin
    // );
    // const dappInfo = isFromAuthorizedDapp
    //   ? masterController.dapps.getDappInfoByURL(sender.origin)
    //   : undefined;
    const isFromApp = fromApp(port.sender?.url);
    const isFromConfirm = fromConfirm(port.sender?.url);
    const walletIsLocked = masterController.wallet.isLocked();

    console.log('messagesHandler.onMessage: ', isFromApp, isFromConfirm, walletIsLocked);
    console.log(JSON.stringify(message,null,2));

    if (message.type === 'ENABLE_REQUEST') {
      if (walletIsLocked) {
        return sendError('Wallet is Locked');
      }
      masterController.createPopup(uuid());
      return Promise.resolve({ id: message.id, result: '🚀 Connection Request!' });
    }
    return Promise.resolve({ id: message.id, result: 'Hi from content script' });
  }


  port.onMessage.addListener(listener);
};
