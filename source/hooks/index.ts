import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

export function useController() {
  return browser.extension.getBackgroundPage().controller;
}

export function useClipboard() {
  const [copyTooltip, setCopyTooltip] = useState('Copy to clipboard');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setCopyTooltip('Copied');
    setTimer(
      setTimeout(() => {
        setCopyTooltip('Copy to clipboard');
      }, 2000)
    );
  }, []);

  return { copyTooltip, handleCopy };
}
