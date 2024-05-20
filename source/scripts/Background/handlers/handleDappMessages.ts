import { addDapp, removeDapp, setCurrent } from 'state/dapp';
import { IDAppInfo } from 'state/dapp/types';
import store from 'state/store';

import { AvailableWalletEvent, ProtocolProvider } from 'scripts/common';
import { StargazerWSMessageBroker } from '../messaging';
import { DappMessage, DappMessageEvent, MessageType } from '../messaging/types';
import { getAllEVMChains } from '../controllers/EVMChainController/utils';
import { DAG_NETWORK } from 'constants/index';

export const notifyAccountsChanged = async (
  origin: string,
  network: ProtocolProvider,
  accounts: string[]
) => {
  const { whitelist } = store.getState().dapp;

  if (!whitelist[origin]) return;

  await StargazerWSMessageBroker.sendEvent(
    network,
    AvailableWalletEvent.accountsChanged,
    [accounts],
    [origin]
  );
};

export const notifyChainChanged = async (network: ProtocolProvider, chainId: string) => {
  if (!network || !chainId) return;

  const networkInfo =
    network === ProtocolProvider.ETHEREUM ? getAllEVMChains() : DAG_NETWORK;

  if (!networkInfo[chainId]) return;

  const { hexChainId } = networkInfo[chainId];

  await StargazerWSMessageBroker.sendEvent(network, AvailableWalletEvent.chainChanged, [
    hexChainId,
  ]);
};

export const notifyDisconnect = async (origin: string) => {
  if (!origin) return;

  await StargazerWSMessageBroker.sendEvent(
    ProtocolProvider.CONSTELLATION,
    AvailableWalletEvent.disconnect,
    [],
    [origin]
  );

  await StargazerWSMessageBroker.sendEvent(
    ProtocolProvider.ETHEREUM,
    AvailableWalletEvent.disconnect,
    [],
    [origin]
  );
};

export const setCurrentDapp = (origin: string, title: string, logo: string) => {
  const current: IDAppInfo = {
    origin,
    logo,
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

export const handleChainChanged = async (
  message: DappMessage,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: any) => void
) => {
  const { network, chainId }: { network: ProtocolProvider; chainId: string } =
    message?.payload ?? {};

  if (!chainId || !network) {
    throw new Error('Unable to notify chainChanged');
  }

  await notifyChainChanged(network, chainId);
};

export const handleDappConnect = async (
  message: DappMessage,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: any) => void
) => {
  const { origin, dapp, network, accounts } = message?.payload ?? {};

  if (!origin || !dapp || !network || !accounts) {
    throw new Error('Unable to connect dapp');
  }

  store.dispatch(addDapp({ id: origin, dapp, network, accounts }));

  await notifyAccountsChanged(origin, network, accounts);
};

export const handleDappDisconnect = async (
  message: DappMessage,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (response?: any) => void
) => {
  const { origin } = message?.payload ?? {};

  if (!origin) {
    throw new Error('Unable to disconnect dapp');
  }

  await notifyDisconnect(origin);

  store.dispatch(removeDapp({ id: origin }));
};

const onDappMessage = (
  message: DappMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (message?.type !== MessageType.dapp) return;
  if (!message?.event) return;

  switch (message.event) {
    case DappMessageEvent.connect:
      return handleDappConnect(message, sender, sendResponse);
    case DappMessageEvent.disconnect:
      return handleDappDisconnect(message, sender, sendResponse);
    case DappMessageEvent.chainChanged:
      return handleChainChanged(message, sender, sendResponse);
    default:
      return;
  }
};

export const handleDappMessages = () => {
  chrome.runtime.onMessage.addListener(onDappMessage);
};
