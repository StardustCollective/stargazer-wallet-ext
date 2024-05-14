import { addDapp, removeDapp, setCurrent } from 'state/dapp';
import { IDAppInfo } from 'state/dapp/types';
import store from 'state/store';
import includes from 'lodash/includes';
import filter from 'lodash/filter';

import { AvailableWalletEvent, ProtocolProvider } from 'scripts/common';
import { StargazerWSMessageBroker } from '../messaging';

export const notifyAccountsChanged = (accounts: string[]) => {
  const { whitelist } = store.getState().dapp;

  // Will only notify whitelisted dapps that are listening for a wallet change.
  for (const origin of Object.keys(whitelist)) {
    const site = whitelist[origin];

    if (!site) {
      continue;
    }

    const siteAccounts = site.accounts;
    const allAccountsWithDuplicates = accounts.concat(
      siteAccounts.Constellation,
      siteAccounts.Ethereum
    );

    const matchingAccounts = filter(allAccountsWithDuplicates, (value, index, iteratee) =>
      includes(iteratee, value, index + 1)
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

    console.log({ ethAccounts, dagAccounts });

    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.CONSTELLATION,
      AvailableWalletEvent.accountsChanged,
      [dagAccounts]
    );

    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.ETHEREUM,
      AvailableWalletEvent.accountsChanged,
      [ethAccounts]
    );
  }
};

export const setCurrentDapp = (origin: string, title: string) => {
  const current: IDAppInfo = {
    origin,
    logo: `chrome://favicon/size/64@1x/${origin}`,
    title,
  };

  store.dispatch(setCurrent(current));

  return isDappConnected(origin);
};

export const getUrlOrigin = (url: string) => {
  return new URL(url).origin;
};

export const getTabOrigin = (tab: chrome.tabs.Tab) => {
  return getUrlOrigin(tab.url);
};

export const isDappConnected = (origin: string) => {
  if (!origin) {
    throw new Error('isDappConnected: origin must be a string');
  }

  const { dapp } = store.getState();
  return !!dapp.whitelist[origin];
};

export const handleDappConnect = (payload: any) => {
  const { origin, dapp, network, accounts } = payload;

  if (!origin || !dapp || !network || !accounts) {
    throw new Error('Unable to connect dapp');
  }

  store.dispatch(addDapp({ id: origin, dapp, network, accounts }));

  notifyAccountsChanged(accounts);
};

export const handleDappDisconnect = (payload: { origin: string }) => {
  const { origin } = payload;

  if (!origin) {
    throw new Error('Unable to disconnect dapp');
  }

  store.dispatch(removeDapp({ id: origin }));

  StargazerWSMessageBroker.sendEvent(
    ProtocolProvider.CONSTELLATION,
    AvailableWalletEvent.disconnect,
    [],
    [origin]
  );

  StargazerWSMessageBroker.sendEvent(
    ProtocolProvider.ETHEREUM,
    AvailableWalletEvent.disconnect,
    [],
    [origin]
  );
};

export const handleDappMessages = () => {
  const broker = new StargazerWSMessageBroker();
  broker.init();
};
