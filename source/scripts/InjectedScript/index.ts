import { StargazerWalletProvider } from './stargazerWalletProvider';

import { readOnlyProxy } from '../common';
declare global {
  interface Window {
    stargazer: StargazerWalletProvider;
  }
}

window.stargazer = readOnlyProxy(new StargazerWalletProvider());
