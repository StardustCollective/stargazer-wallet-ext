import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { CaptureProtection } from 'react-native-capture-protection';

// Android ignores the options and toggles FLAG_SECURE for the whole window.
const SECURE_SCREEN_OPTIONS = { screenshot: true, record: true };

// Capture protection is window-wide, so count the focused screens that need it.
// Navigating between two secure screens focuses the new one before blurring the old one;
// without the count, the old screen's cleanup would turn protection off for the new one.
let secureScreenCount = 0;

const acquire = () => {
  secureScreenCount += 1;
  if (secureScreenCount === 1) CaptureProtection.prevent(SECURE_SCREEN_OPTIONS);
};

const release = () => {
  secureScreenCount = Math.max(0, secureScreenCount - 1);
  if (secureScreenCount === 0) CaptureProtection.allow(SECURE_SCREEN_OPTIONS);
};

// Blocks screenshots and screen recording while the screen is focused (and the recents
// thumbnail on Android). The iOS app switcher snapshot is covered globally by AutoLock.
const useSecureScreen = (enabled = true) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return undefined;

      acquire();
      return release;
    }, [enabled])
  );
};

export default useSecureScreen;
