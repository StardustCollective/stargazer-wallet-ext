import { useCallback } from 'react';
import { NativeModules } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { androidPlatform } from 'utils/platform';

const { SecureScreen } = NativeModules;

// Blocks screenshots, screen recording and the recents thumbnail while the screen is focused.
// Android only: on iOS the app switcher snapshot is covered globally in AppDelegate.
const useSecureScreen = (enabled = true) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled || !androidPlatform() || !SecureScreen) return undefined;

      SecureScreen.enable();
      return () => SecureScreen.disable();
    }, [enabled])
  );
};

export default useSecureScreen;
