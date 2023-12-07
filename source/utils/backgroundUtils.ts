import { browser } from 'webextension-polyfill-ts';

export const cancelEvent = async (windowId: any) => {
  const event = new CustomEvent('transactionSent', {
    detail: { windowId, approved: false, result: false },
  });
  const background = await browser.runtime.getBackgroundPage();
  background.dispatchEvent(event);
};
