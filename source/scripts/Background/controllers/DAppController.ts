import includes from 'lodash/includes';
import filter from 'lodash/filter';
import { listNewDapp, unlistDapp } from 'state/dapp';
import { IDAppInfo } from 'state/dapp/types';
import store from 'state/store';
import { AvailableEvents, ProtocolProvider } from 'scripts/common';
import { getDappRegistry } from 'utils/controllersUtils';

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

  async #notifySiteDisconnected(origin: string) {
    console.log('notifySiteDisconnected');
    getDappRegistry().sendOriginChainEvent(origin, '*', AvailableEvents.disconnect);
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
    const { whitelist } = state.dapp;

    // Will only notify whitelisted dapps that are listening for a wallet change.
    for (const origin of getDappRegistry().onlineOrigins) {
      const site = whitelist[origin];

      if (!site) {
        continue;
      }

      const siteAccounts = site.accounts;
      const allAccountsWithDuplicates = accounts.concat(
        siteAccounts.Constellation,
        siteAccounts.Ethereum
      );

      const matchingAccounts = filter(
        allAccountsWithDuplicates,
        (value, index, iteratee) => includes(iteratee, value, index + 1)
      );

      if (matchingAccounts.length === 0) {
        continue;
      }

      const ethAccounts = matchingAccounts.filter((account) =>
        account.toLowerCase().startsWith('0x')
      );
      const dagAccounts = matchingAccounts.filter((account) =>
        account.toLowerCase().startsWith('dag')
      );

      getDappRegistry().sendOriginChainEvent(
        origin,
        ProtocolProvider.CONSTELLATION,
        AvailableEvents.accountsChanged,
        [dagAccounts]
      );
      getDappRegistry().sendOriginChainEvent(
        origin,
        ProtocolProvider.ETHEREUM,
        AvailableEvents.accountsChanged,
        [ethAccounts]
      );
    }
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

  isDAppConnected(origin: string) {
    const dappState = store.getState().dapp;
    return !!dappState.whitelist[origin];
  }
}

export { DAppController };
