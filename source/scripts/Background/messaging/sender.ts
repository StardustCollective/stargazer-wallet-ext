// Content scripts report the web page's URL in sender.url; only extension pages
// (popup, external.html, hardware wallet pages) report chrome-extension://<id>/...
export const isExtensionPageSender = (sender?: chrome.runtime.MessageSender) => {
  return !!sender?.url?.startsWith(chrome.runtime.getURL(''));
};
