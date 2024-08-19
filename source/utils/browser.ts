export const open = async (url: string) => {
  window.open(url, '_blank');
};

export const reload = () => {
  chrome.runtime.reload();
};
