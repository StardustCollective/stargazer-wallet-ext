import { browser, Runtime } from 'webextension-polyfill-ts';
import { IMasterController } from '.';
import { v4 as uuid } from 'uuid';

type Message = {
  id: string;
  type: string;
  data: {
    asset: string;
    method: string;
    args: any[];
    network: string;
    origin?: string;
    to?: string;
    from?: string;
    value?: string;
    gas?: string;
    data: string;
  };
};

export const messagesHandler = (
  port: Runtime.Port,
  masterController: IMasterController
) => {
  let pendingWindow = false;

  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const response = await listenerHandler(message, connection);

      //console.log('listenerHandler.RESPONSE', response);

      if (response) {
        const { id, result } = response;
        //console.log('messagesHandler.RESPONSE');
        //console.log(JSON.stringify(result, null, 2));
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

    const sendError = (error: string) => {
      return Promise.reject(new CustomEvent(message.id, { detail: error }));
    };

    const walletIsLocked = !masterController.wallet.isUnlocked();

    const url = connection.sender?.url as string;
    const title = connection.sender?.tab?.title as string;
    const origin = url && new URL(url as string).origin;

    const allowed = masterController.dapp.fromPageConnectDApp(origin, title);

    if (message.type === 'STARGAZER_EVENT_REG') {

      const listenerOrigin = message.data.origin;
      const method = message.data.method;

      if (method === 'accountsChanged') {

        // Register the origin of the site that is listening for 
        // account changed.
        masterController.dapp.registerSite(listenerOrigin);

        window.addEventListener(
          'accountsChanged',
          (event: any) => {
            let { accounts, origin } = event.detail;
            // The event origin is checked to prevent sites that have not been
            // granted permissions to the user's account information from
            // receiving updates.
            if (origin === listenerOrigin) {
              port.postMessage({ id: message.id, data: accounts });
            }
          },
          { passive: true }
        );
      }

    } else if (message.type === 'ENABLE_REQUEST') {
      const { asset } = message.data;
      const provider = asset === 'DAG' ? masterController.stargazerProvider : masterController.ethereumProvider;

      if (origin && !allowed) {
        if (pendingWindow) {
          return Promise.resolve(null);
        }

        const windowId = uuid();
        const popup = await masterController.createPopup(
          windowId,
          message.data.network,
          'selectAccounts'
        );
        pendingWindow = true;

        window.addEventListener(
          'connectWallet',
          (ev: any) => {
            console.log('Connect window addEventListener', ev.detail);
            if (ev.detail.windowId === windowId) {
              port.postMessage({
                id: message.id,
                data: {
                  result: true,
                  data: { accounts: provider.getAccounts() }
                },
              });
              pendingWindow = false;
            }
          },
          { once: true, passive: true }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (popup && id === popup.id) {
            port.postMessage({ id: message.id, data: { result: origin && allowed } });
            pendingWindow = false;
          }
        });

        return Promise.resolve(null);
      }

      return Promise.resolve({ id: message.id, result: origin && allowed });
    } else if (message.type === 'CAL_REQUEST') {
      const { method, args, asset } = message.data;

      console.log('CAL_REQUEST.method', method, args);

      const provider = asset === 'DAG' ? masterController.stargazerProvider : masterController.ethereumProvider;

      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed && !walletIsLocked };
      } else if (method === 'wallet.getAddress') {
        result = provider.getAddress();
      } else if (method === 'wallet.getAccounts') {
        result = provider.getAccounts();
      } else if (method === 'wallet.getChainId') {
        result = provider.getChainId();
      } else if (method === 'wallet.getNetwork') {
        result = provider.getNetwork();
      } else if (method === 'wallet.getBalance') {
        result = provider.getBalance();
        // } else if (method === 'wallet.setLedgerAccounts') {
        //     await window.controller.stargazerProvider.importLedgerAccounts(args[0]);
        //     // port.postMessage({ id: message.id, data: { result: "success" } });
        //   return Promise.resolve({ id: message.id, result: "success" });
        // } else if (method === 'wallet.postTransactionResult') {
        //   await window.controller.stargazerProvider.postTransactionResult(args[0]);
        //   return Promise.resolve({ id: message.id, result: "success" });
      } else if (method === 'wallet.signMessage') {
        if (pendingWindow) {
          return Promise.resolve(null);
        }

        const windowId = `signMessage${uuid()}`;
        const popup = await masterController.createPopup(windowId);
        pendingWindow = true;
        masterController.dapp.setSigRequest({
          origin: origin as string,
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
          if (popup && id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            //console.log('SignMessage window is closed');
            pendingWindow = false;
          }
        });

        return Promise.resolve(null);
      } else if (method === 'wallet.sendTransaction') {
        const data = message.data.args[0];

        const windowId = uuid();
        const popup = await masterController.createPopup(
          windowId,
          message.data.network,
          'sendTransaction',
          {...data},
        );

        pendingWindow = true;

        window.addEventListener(
          'spendApproved',
          (ev: any) => {
            console.log('Connect window addEventListener', ev.detail);
            if (ev.detail.hash.substring(1) === windowId) {

              // Post transaction here.

              port.postMessage({
                id: message.id,
                data: { result: true, data: { accounts: ev.detail.accounts } },
              });
              pendingWindow = false;
            }
          },
          { once: true, passive: true }
        );


      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result });
      }

      return sendError('Unknown request');
    } else {
      return Promise.resolve({
        id: message.id,
        result: 'Hi from content script',
      });
    }

    return Promise.resolve(null);
  };

  port.onMessage.addListener(listener);
};
