import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export function useSettingsView() {
  const history = useHistory();

  return useCallback(view => {
    history.push(view);
  }, []);
}

// A single pending clear shared across the app: any later copy supersedes it, so a secret's
// timer never wipes something copied after it. The timer outlives the screen on purpose,
// since the secret stays on the clipboard after the screen unmounts.
let pendingClipboardClear: ReturnType<typeof setTimeout> | null = null;

// clearAfter (ms) wipes the clipboard later, for secrets such as seed phrases and private keys.
// Reading the clipboard back would trigger the iOS paste prompt, so it is cleared unconditionally.
export function useCopyClipboard(
  timeout = 1000,
  clearAfter?: number
): [boolean, (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback(
    text => {
      Clipboard.setString(text);
      setIsCopied(true);

      if (pendingClipboardClear) {
        clearTimeout(pendingClipboardClear);
        pendingClipboardClear = null;
      }

      if (clearAfter) {
        pendingClipboardClear = setTimeout(() => {
          pendingClipboardClear = null;
          Clipboard.setString('');
        }, clearAfter);
      }
    },
    [clearAfter]
  );

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
