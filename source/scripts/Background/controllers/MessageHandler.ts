import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';

type Message = {
  id: string;
  type: string;
  data: { asset: string; method: string; args: any[] };
}

export const messagesHandler = (
  port: Runtime.Port,
  masterController: IMasterController
) => {
  const externalConnectionApprovalMap: {[origin: string]: true} = {};

  const fromApp = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/app.html`);
  };
  const fromConfirm = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/confirm.html`);
  };

  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const { id, result } = await listenerHandler(message, connection);
      console.log('messagesHandler.RESPONSE');
      console.log(JSON.stringify(result, null, 2));
      port.postMessage({ id, data: { result } });
    } catch (e) {
      console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      console.log(JSON.stringify(e, null, 2));
      port.postMessage({ id: e.type, data: { error: e.detail } });
    }
  };

  const listenerHandler = async (message: Message, connection: Runtime.Port) => {
    if (browser.runtime.lastError) return Promise.reject('Runtime Last Error');

    const sendError = (error: string) =>
      Promise.reject(new CustomEvent(message.id, { detail: error }));
    // const isFromAuthorizedDapp = masterController.fromAuthorizedDapp(
    //   sender.origin
    // );
    // const dappInfo = isFromAuthorizedDapp
    //   ? masterController.dapps.getDappInfoByURL(sender.origin)
    //   : undefined;
    const isFromApp = fromApp(port.sender?.url);
    const isFromConfirm = fromConfirm(port.sender?.url);
    const walletIsLocked = masterController.wallet.isLocked();

    console.log(
      'messagesHandler.onMessage: ',
      isFromApp,
      isFromConfirm,
      walletIsLocked
    );
    console.log(JSON.stringify(message, null, 2));

    const url = connection.sender?.url;
    const origin = url && new URL(url as string).origin;

    const allowed = origin && externalConnectionApprovalMap[origin];

    console.log('messagesHandler.onMessage: ' + origin, allowed);

    //NOTE
    //1. wallet is locked and needs password unlocked
    //2. wallet is unlocked but this origin needs approval
    //3, wallet is not detected. could be that it is not installed or there's an outdated version.
    if (message.type === 'ENABLE_REQUEST') {

      if (walletIsLocked) {
        return sendError('Wallet is Locked');
      }

      masterController.createPopup(uuid());

      //TODO - we need popup above to resolve this promise and set approval flag

      if (origin) {
        externalConnectionApprovalMap[origin] = true;
      }

      return Promise.resolve({ id: message.id, result: true });

    } else if (message.type === 'CAL_REQUEST') {
      const { method, args } = message.data;
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = !!allowed && !walletIsLocked;
      } else if (method === 'wallet.getAddress') {
        result = masterController.stargazerProvider.getAddress();
      } else if (method === 'wallet.signMessage') {
        result = masterController.stargazerProvider.signMessage(args[0]);
      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result: result });
      }

      return sendError('Unknown request');
    }
    return Promise.resolve({
      id: message.id,
      result: 'Hi from content script',
    });
  };

  port.onMessage.addListener(listener);
};
