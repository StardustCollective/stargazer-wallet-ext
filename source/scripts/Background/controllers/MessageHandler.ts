import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';
import store from 'state/store';
import watch from 'redux-watch';
import IWalletState from 'state/wallet/types';

type Message = {
  id: string;
  type: string;
  data: { asset: string; method: string; args: any[] };
};

export const messagesHandler = (
  port: Runtime.Port,
  masterController: IMasterController
) => {
  // const externalConnectionApprovalMap: { [origin: string]: true } = {};

  const fromApp = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/app.html`);
  };
  const fromConfirm = (url: string = '') => {
    return url.startsWith(`${window.location.origin}/confirm.html`);
  };

  let pendingWindow = false;

  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const response = await listenerHandler(message, connection);
      if (response) {
        const { id, result } = response;
        console.log('messagesHandler.RESPONSE');
        console.log(JSON.stringify(result, null, 2));
        port.postMessage({ id, data: { result } });
      }
    } catch (e) {
      console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      console.log(JSON.stringify(e, null, 2));
      port.postMessage({ id: e.type, data: { error: e.detail } });
    }
  };

  const listenerHandler = async (
    message: Message,
    connection: Runtime.Port
  ) => {
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

    const allowed = origin && masterController.dapp.fetchInfo(origin, true);

    console.log('messagesHandler.onMessage: ' + origin, allowed);

    //NOTE
    //1. wallet is locked and needs password unlocked
    //2. wallet is unlocked but this origin needs approval
    //3, wallet is not detected. could be that it is not installed or there's an outdated version.
    if (message.type === 'ENABLE_REQUEST') {
      if (walletIsLocked) {
        const { seedKeystoreId }: IWalletState = store.getState().wallet;
        if (!seedKeystoreId) {
          return sendError('Need to set up Wallet');
        }

        if (pendingWindow) {
          return Promise.resolve(null);
        }
        const windowId = uuid();
        const popup = await masterController.createPopup(windowId);
        pendingWindow = true;

        window.addEventListener(
          'loginWallet',
          (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              port.postMessage({
                id: message.id,
                data: { result: true },
              });
              pendingWindow = false;
            }
          },
          {
            once: true,
            passive: true,
          }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            pendingWindow = false;
          }
        });
        return Promise.resolve(null);
      }

      //TODO - we need popup above to resolve this promise and set approval flag

      if (origin && !allowed) {
        if (pendingWindow) {
          return Promise.resolve(null);
        }

        const popup = await masterController.createPopup(uuid());
        pendingWindow = true;
        const w = watch(store.getState, 'dapp');
        store.subscribe(
          w((newState) => {
            pendingWindow = false;
            port.postMessage({
              id: message.id,
              data: { result: !!newState[origin] },
            });
          })
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            pendingWindow = false;
            console.log('Connect window is closed');
          }
        });

        return Promise.resolve(null);
      }
      return Promise.resolve({ id: message.id, result: origin && allowed });
    } else if (message.type === 'CAL_REQUEST') {
      const { method, args } = message.data;
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed && !walletIsLocked };
      } else if (method === 'wallet.getAddress') {
        result = masterController.stargazerProvider.getAddress();
      } else if (method === 'wallet.getBalance') {
        result = masterController.stargazerProvider.getBalance();
      } else if (method === 'wallet.signMessage') {
        if (pendingWindow) {
          return Promise.resolve(null);
        }

        const windowId = `signMessage${uuid()}`;
        const popup = await masterController.createPopup(windowId);
        pendingWindow = true;
        masterController.dapp.setSigRequest({
          origin,
          address: args[1],
          message: args[0],
        });
        window.addEventListener(
          'sign',
          (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              result = masterController.stargazerProvider.signMessage(args[0]);
              port.postMessage({ id: message.id, data: { result } });
              pendingWindow = false;
            }
          },
          {
            once: true,
            passive: true,
          }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            console.log('SignMessage window is closed');
            pendingWindow = false;
          }
        });

        return Promise.resolve(null);
      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result });
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
