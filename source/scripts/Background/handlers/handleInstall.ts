import 'emoji-log';

export const handleInstall = () => {
  chrome.runtime.onInstalled.addListener(async () => {
    console.emoji('🤩', 'Stargazer extension installed');
  });
};
