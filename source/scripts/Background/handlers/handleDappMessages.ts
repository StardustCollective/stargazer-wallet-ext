import { addDapp, removeDapp, setCurrent } from 'state/dapp';
import { IDAppInfo } from 'state/dapp/types';
import store from 'state/store';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import {
  DappMessage,
  DappMessageID,
  MessageType,
} from 'scripts/Background/messaging/types';
// import { AvailableEvents, ProtocolProvider } from 'scripts/common';

// export const sendOriginChainEvent = async (
//   origin: '*' | string,
//   chain: '*' | ProtocolProvider,
//   event: AvailableEvents,
//   data: any[] = []
// ) => {
//   if (origin === '*') {
//     console.log({ chain, event, data });
//     const tabs = await chrome.tabs.query({ active: true });
//     console.log('tabs', tabs);
//     const filteredTabs = tabs.filter((tab) =>
//       tab?.url?.startsWith('https://demos-react')
//     );
//     console.log('filteredTabs', filteredTabs);
//     for (const tab of filteredTabs) {
//       const tabId = tab.id;
//       if (tabId) {
//         console.log('tabId', tabId);
//         const message = await chrome.tabs.sendMessage(tabId, { data });
//         console.log('message', message);
//       }
//     }

//     return;
//   }
// };

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

    // TODO: Notify accounts changed to all tabs
    // sendOriginChainEvent(
    //   '*',
    //   ProtocolProvider.CONSTELLATION,
    //   AvailableEvents.accountsChanged,
    //   [dagAccounts]
    // );

    // sendOriginChainEvent(
    //   '*',
    //   ProtocolProvider.ETHEREUM,
    //   AvailableEvents.accountsChanged,
    //   [ethAccounts]
    // );
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

  // TODO: notify accounts changed to origin
  notifyAccountsChanged(accounts);
};

export const handleDappDisconnect = (payload: any) => {
  const { origin } = payload;

  if (!origin) {
    throw new Error('Unable to disconnect dapp');
  }

  // TODO: Notify site disconnect to all tabs
  store.dispatch(removeDapp({ id: origin }));
};

const onDappMessage = (message: DappMessage) => {
  if (message?.type !== MessageType.dapp) return;

  const { id, payload } = message || {};

  if (!id || !payload) return;

  switch (id) {
    case DappMessageID.connect:
      handleDappConnect(payload);
      break;
    case DappMessageID.disconnect:
      handleDappDisconnect(payload);
      break;
    case DappMessageID.notifyAccounts:
      const { accounts } = payload;
      if (!accounts) {
        throw new Error('Accounts must be provided');
      }
      notifyAccountsChanged(accounts);
      break;

    default:
      throw new Error('Dapp message not found.');
  }
};

export const handleDappMessages = () => {
  chrome.runtime.onMessage.addListener(onDappMessage);
};
