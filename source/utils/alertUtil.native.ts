import { showMessage, MessageType } from 'react-native-flash-message';

export const usePlatformAlert = () => {
  return (message: string, type: MessageType) => {
    showMessage({
      message,
      type,
      duration: 5000,
      hideStatusBar: true,
      style: { justifyContent: 'center' },
    });
    return;
  };
};
