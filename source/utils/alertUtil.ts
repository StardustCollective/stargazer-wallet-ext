/*
Wrapper to handle alerts between mobile and web
*/

import { Platform } from 'react-native';
import { showMessage, MessageType } from 'react-native-flash-message';
import { useAlert } from 'react-alert';

export const usePlatformAlert = () => {
  const alert = Platform.OS === 'web' ? useAlert() : null;

  return (message: string, type: MessageType | undefined | null) => {
    if (alert === null) {
      showMessage({
        message,
        type,
        duration: 4000,
        hideStatusBar: true,
        style: { height: 90, justifyContent: 'center' },
      });
      return;
    }

    if (alert !== null) {
      alert.removeAll();

      if (type === 'danger') {
        alert.error(message);
      } else {
        alert.show(message);
      }
      return;
    }
  };
};
