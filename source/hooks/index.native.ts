import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import Clipboard from '@react-native-community/clipboard';

export function useSettingsView() {
  const history = useHistory();

  return useCallback((view) => {
    history.push(view);
  }, []);
}

export function useCopyClipboard(timeout = 1000): [boolean, (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback((text) => {
    Clipboard.setString(text);
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
