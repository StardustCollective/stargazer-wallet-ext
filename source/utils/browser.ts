export const open = async (url: string) => {
  window.open(url, '_blank');
};

export const reload = () => {
  // TODO: test Manifest V3
  chrome.runtime.reload();
};
