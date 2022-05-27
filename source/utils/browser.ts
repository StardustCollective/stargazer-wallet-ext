import { browser } from 'webextension-polyfill-ts';

export const open = async (url: string) => {
  window.open(url, '_blank');
}

export const reload = () => {
  browser.runtime.reload();
};