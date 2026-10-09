import { useCallback } from 'react';
import { NativeModules } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { androidPlatform } from 'utils/platform';

const { SecureScreen } = NativeModules;

// FLAG_SECURE is a single window-wide flag, so count the focused screens that need it.
// Navigating between two secure screens focuses the new one before blurring the old one;
// without the count, the old screen's cleanup would turn protection off for the new one.
let secureScreenCount = 0;

const acquire = () => {
  secureScreenCount += 1;
  if (secureScreenCount === 1) SecureScreen.enable();
};

const release = () => {
  secureScreenCount = Math.max(0, secureScreenCount - 1);
  if (secureScreenCount === 0) SecureScreen.disable();
};

// Blocks screenshots, screen recording and the recents thumbnail while the screen is focused.
// Android only: on iOS the app switcher snapshot is covered globally in AppDelegate.
const useSecureScreen = (enabled = true) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled || !androidPlatform() || !SecureScreen) return undefined;

      acquire();
      return release;
    }, [enabled])
  );
};

export default useSecureScreen;
