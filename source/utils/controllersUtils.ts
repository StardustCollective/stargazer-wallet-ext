import { browser } from 'webextension-polyfill-ts';

export function getController() {
  return browser.extension.getBackgroundPage().controller;
}

export const getWalletController = () => {
  return getController().wallet;
}

export const getAccountController = () => {
  return getController().wallet.account;
}