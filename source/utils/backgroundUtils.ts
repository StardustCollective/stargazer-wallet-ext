export const cancelEvent = async (windowId: any) => {
  const event = new CustomEvent('transactionSent', {
    detail: { windowId, approved: false, result: false },
  });
  // TODO: test Manifest V3
  const background = await chrome.runtime.getBackgroundPage();
  background.dispatchEvent(event);
};
