import { StargazerWalletProvider } from './stargazerWalletProvider';

declare global {
  interface Window {
    stargazer: StargazerWalletProvider;
  }
}

window.stargazer = new Proxy(new StargazerWalletProvider(), {
  set: () => false,
  defineProperty: () => false,
  deleteProperty: () => false,
  setPrototypeOf: () => false,
});
