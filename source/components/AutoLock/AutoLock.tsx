import { useLinkTo } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { CaptureProtection } from 'react-native-capture-protection';

import { color } from 'assets/styles/tokens';

import { getWalletController } from 'utils/controllersUtils';
import { iosPlatform } from 'utils/platform';

const LOGOUT_TIMEOUT = 1000 * 60 * 5; // 5 minutes

// Locks the wallet after LOGOUT_TIMEOUT in background. The background timer covers Android;
// iOS suspends JS, so there the elapsed time is checked when the app becomes active again,
// and the app stays covered until then so the unlocked wallet never flashes on return.
// Must be rendered inside the NavigationContainer, above every screen.
const AutoLock: FC = () => {
  const linkTo = useLinkTo();
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    // Hides wallet content such as seed phrases from the app switcher snapshot
    if (iosPlatform()) {
      CaptureProtection.prevent({ appSwitcher: true });
    }
  }, []);

  useEffect(() => {
    const walletController = getWalletController();
    let backgroundedAt: number | null = null;

    const lock = async () => {
      BackgroundTimer.stopBackgroundTimer();
      if (walletController.isUnlocked()) {
        // Logout the user and navigate to the log in screen
        await walletController.logOut();
        linkTo('/authRoot');
      }
    };

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        if (!walletController.isUnlocked()) return;
        backgroundedAt = Date.now();
        if (iosPlatform()) setCovered(true);
        BackgroundTimer.runBackgroundTimer(lock, LOGOUT_TIMEOUT);
      } else if (nextState === 'active') {
        BackgroundTimer.stopBackgroundTimer();
        const lockDue = !!backgroundedAt && Date.now() - backgroundedAt >= LOGOUT_TIMEOUT;
        backgroundedAt = null;
        // Uncover only after the login screen has rendered
        (lockDue ? lock() : Promise.resolve()).finally(() => requestAnimationFrame(() => setCovered(false)));
      }
    });

    return () => {
      subscription.remove();
      BackgroundTimer.stopBackgroundTimer();
    };
  }, []);

  return covered ? <View style={styles.cover} /> : null;
};

const styles = StyleSheet.create({
  cover: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.brand_900,
  },
});

export default AutoLock;
