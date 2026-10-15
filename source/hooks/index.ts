import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

export function useSettingsView() {
  const history = useHistory();

  return useCallback((view: any) => {
    history.push(view);
  }, []);
}

// clearAfter is only honoured on mobile: extension popups close long before it would fire.
export function useCopyClipboard(
  timeout = 1000,
  _clearAfter?: number
): [boolean, (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback(async (text: any) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => {
        clearTimeout(hide);
      };
    }
    return undefined;
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy];
}
