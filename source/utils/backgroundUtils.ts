import { browser } from 'webextension-polyfill-ts';

export const cancelEvent = async (windowId) => {

  const cancelEvent = new CustomEvent('transactionSent', { detail: { windowId, approved: false, result: false } });
  const background = await browser.runtime.getBackgroundPage();
  background.dispatchEvent(cancelEvent);

}