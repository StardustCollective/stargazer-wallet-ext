import { readOnlyProxy } from '../common';
import { StargazerAnnounceProvider } from './announce_provider';
import { StargazerISMessageBroker } from './is_message_broker';
import { StargazerWalletProvider } from './wallet_provider';

declare global {
  interface Window {
    stargazer: StargazerWalletProvider;
  }
}
const broker = new StargazerISMessageBroker();
broker.init();

const announceProvider = new StargazerAnnounceProvider(broker);
announceProvider.announceProvider();

window.stargazer = readOnlyProxy(new StargazerWalletProvider(broker));
