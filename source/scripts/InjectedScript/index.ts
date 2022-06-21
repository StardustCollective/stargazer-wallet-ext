import { readOnlyProxy } from '../common';

import { StargazerWalletProvider } from './stargazerWalletProvider';
import { retreiveInjectedProxyId } from './utils';
declare global {
  interface Window {
    stargazer: StargazerWalletProvider;
  }
}

retreiveInjectedProxyId();
window.stargazer = readOnlyProxy(new StargazerWalletProvider());
