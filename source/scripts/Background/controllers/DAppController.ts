import includes from 'lodash/includes';
import filter from 'lodash/filter';
import { browser } from 'webextension-polyfill-ts';
import {
  listNewDapp,
  unlistDapp,
  registerListeningSite as registerListeningSiteAction,
  deregisterListeningSite as deregisterListeningSiteAction,
} from 'state/dapp';
import { IDAppInfo } from 'state/dapp/types';
import store from 'state/store';

type ISigRequest = {
  address: string;
  message: string;
  origin: string;
};

class DAppController {
  #current: IDAppInfo;
  #request: ISigRequest | null;

  constructor() {
    this.#current = { origin: '', logo: '', title: '' };
    this.#request = null;
  }

  async #dispatchEvents(events: CustomEvent[]) {
    const background = await browser.runtime.getBackgroundPage();

    events.forEach((event) => background.dispatchEvent(event));
  }

  async #notifySiteDisconnected(origin: string) {
    console.log('notifySiteDisconnected');
    const state = store.getState();
    const listening = state.dapp.listening;
    const listeningEvents = listening[origin];

    if (!!listeningEvents && !listeningEvents.includes('close')) {
      console.log('notifySiteDisconnected includes close');
      return;
    }

    // Dispatch a separate event for each chain
    const events = [
      new CustomEvent('close', {
        detail: { data: {}, origin, chain: 'ethereum' },
      }),
      new CustomEvent('close', {
        detail: { data: {}, origin, chain: 'constellation' },
      }),
    ];

    console.log('notifySiteDisconnected dispatching: ', events);

    return this.#dispatchEvents(events);
  }

  getCurrent(): IDAppInfo {
    return this.#current;
  }

  fromUserConnectDApp(
    origin: string,
    dapp: IDAppInfo,
    network: string,
    accounts: string[]
  ) {
    store.dispatch(listNewDapp({ id: origin, dapp, network, accounts }));
  }

  fromUserDisconnectDApp(origin: string) {
    this.#notifySiteDisconnected(origin);
    store.dispatch(unlistDapp({ id: origin }));
  }

  notifyAccountsChanged(accounts: string[]) {
    const state = store.getState();
    const { whitelist, listening } = state.dapp;

    const events: CustomEvent[] = [];

    // Will only notify whitelisted dapps that are listening for a wallet change.
    for (const origin of Object.keys(listening)) {
      const site = whitelist[origin];
      const listeningEvents = listening[origin];

      if (!listeningEvents.includes('accountsChanged')) {
        continue;
      }

      if (site) {
        const siteAccounts = site.accounts;
        const allAccountsWithDuplicates = accounts.concat(
          siteAccounts.Constellation,
          siteAccounts.Ethereum
        );

        const matchingAccounts = filter(
          allAccountsWithDuplicates,
          (value, index, iteratee) => includes(iteratee, value, index + 1)
        );

        if (matchingAccounts.length) {
          const ethAccounts = matchingAccounts.filter((account) =>
            account.toLowerCase().startsWith('0x')
          );
          const dagAccounts = matchingAccounts.filter((account) =>
            account.toLowerCase().startsWith('dag')
          );

          // Dispatch a separate event for each chain
          const newEvents = [
            new CustomEvent('accountsChanged', {
              detail: { data: ethAccounts, origin, chain: 'ethereum' },
            }),
            new CustomEvent('accountsChanged', {
              detail: { data: dagAccounts, origin, chain: 'constellation' },
            }),
          ];

          events.push(...newEvents);
        }
      }
    }

    this.#dispatchEvents(events);
  }

  fromPageConnectDApp(origin: string, title: string) {
    this.#current = {
      origin,
      logo: `chrome://favicon/size/64@1x/${origin}`,
      title,
    };

    return this.isDAppConnected(origin);
  }

  setSigRequest(request: ISigRequest) {
    this.#request = request;
  }

  getSigRequest() {
    return this.#request;
  }

  registerListeningSite(origin: string, eventName: string) {
    store.dispatch(registerListeningSiteAction({ origin, eventName }));
  }

  deregisterListeningSite(origin: string, eventName: string) {
    store.dispatch(deregisterListeningSiteAction({ origin, eventName }));
  }

  isSiteListening(origin: string, eventName: string) {
    const dappState = store.getState().dapp;
    return !!dappState.listening[origin]?.includes(eventName);
  }

  isDAppConnected(origin: string) {
    const dappState = store.getState().dapp;
    return !!dappState.whitelist[origin];
  }
}

export { DAppController };
