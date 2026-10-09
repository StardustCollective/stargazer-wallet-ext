///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  AppState,
  NativeModules,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useLinkTo } from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import { iosPlatform } from 'utils/platform';

///////////////////////////
// Components
///////////////////////////

import Sheet from 'components/Sheet';
import TextV3 from 'components/TextV3';
import LoadingDots from 'components/LoadingDots';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up-white.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down-white.svg';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';
import homeHeader from 'navigation/headers/home';
import { truncateString } from 'scenes/home/helpers';
import EventEmitter from 'utils/EventEmitter';

///////////////////////////
// Styles
///////////////////////////

import { KeyringWalletAccountState } from '@stardust-collective/dag4-keyring';
import { NavigationEvents } from 'constants/events';
import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';

///////////////////////////
// Constants
///////////////////////////

import { BUY_STRING, SWAP_STRING } from './constants';
import AssetsPanel from './AssetsPanel';
import WalletsModal from './WalletsModal';
import LinearGradient from 'react-native-linear-gradient';

const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = '#FFF';
const LOGOUT_TIMEOUT = 1000 * 60 * 5; // 5 minutes

// iOS only (AppDelegate): keeps the app switcher cover up until the wallet has been locked
const { PrivacyCover } = NativeModules;
const ICON_SIZE = 14;
let lastIsConnected = true;

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({
  navigation,
  activeWallet,
  balanceObject,
  loadingBalances,
  isDagOnlyWallet,
  multiChainWallets,
  privateKeyWallets,
  onBuyPressed,
  onSwapPressed,
}) => {
  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);

  const walletController = getWalletController();
  const linkTo = useLinkTo();

  const handleSwitchWallet = async (
    walletId: string,
    walletAccounts: KeyringWalletAccountState[]
  ) => {
    setIsWalletSelectorOpen(false);
    EventEmitter.emit(NavigationEvents.RESET_NFTS_TAB);
    await walletController.switchWallet(walletId);
  };

  const renderHeaderTitle = () => {
    const ArrowIcon = isWalletSelectorOpen ? ArrowUpIcon : ArrowDownIcon;
    return (
      <TouchableOpacity
        style={styles.headerTitleContainer}
        onPress={() => setIsWalletSelectorOpen(true)}
      >
        <TextV3.BodyStrong extraStyles={styles.headerTitle}>
          {activeWallet ? truncateString(activeWallet.label) : ''}
        </TextV3.BodyStrong>
        <ArrowIcon width={ICON_SIZE} height={ICON_SIZE} color="white" />
      </TouchableOpacity>
    );
  };

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader(),
      headerTitle: renderHeaderTitle,
    });
  }, [activeWallet, isWalletSelectorOpen]);

  // Subscribe to NetInfo
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && !lastIsConnected) {
        lastIsConnected = true;
      } else {
        lastIsConnected = false;
      }
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  // Lock the wallet after LOGOUT_TIMEOUT in background. The background timer covers Android;
  // iOS suspends JS, so the elapsed time is also checked when the app becomes active again.
  useEffect(() => {
    let backgroundedAt: number | null = null;
    PrivacyCover?.setLockTimeout(LOGOUT_TIMEOUT);

    const lock = async () => {
      BackgroundTimer.stopBackgroundTimer();
      if (walletController.isUnlocked()) {
        // Logout the user and navigate to the log in screen
        await walletController.logOut();
        linkTo('/authRoot');
      }
    };

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        backgroundedAt = Date.now();
        BackgroundTimer.runBackgroundTimer(lock, LOGOUT_TIMEOUT);
      } else if (nextState === 'active') {
        BackgroundTimer.stopBackgroundTimer();
        const lockDue = !!backgroundedAt && Date.now() - backgroundedAt >= LOGOUT_TIMEOUT;
        backgroundedAt = null;
        // Remove the cover only after the login screen has rendered
        (lockDue ? lock() : Promise.resolve()).finally(() => requestAnimationFrame(() => PrivacyCover?.hide()));
      }
    });

    return () => {
      subscription.remove();
      BackgroundTimer.stopBackgroundTimer();
      PrivacyCover?.setLockTimeout(0);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeWallet ? (
          <>
            <View style={styles.fiatBalanceContainer}>
              <View style={styles.fiatBalance}>
                {loadingBalances ? (
                  <LoadingDots containerHeight={48} height={10} width={50} />
                ) : (
                  <>
                    <TextV3.Body extraStyles={styles.fiatType}>
                      {balanceObject.symbol}
                    </TextV3.Body>
                    <TextV3.HeaderDisplay dynamic extraStyles={styles.fiatBalanceLabel}>
                      {balanceObject.balance}
                    </TextV3.HeaderDisplay>
                  </>
                )}
              </View>
              {!iosPlatform() && 
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.buttonContainer} onPress={onBuyPressed} activeOpacity={0.7}>
                    <LinearGradient
                      useAngle
                      angle={180}
                      style={styles.button}
                      locations={[0, 1]}
                      colors={['#7150E2', '#4B22D3']}
                    >
                      <TextV3.LabelSemiStrong extraStyles={styles.buttonLabel}>
                        {BUY_STRING}
                      </TextV3.LabelSemiStrong>
                    </LinearGradient>
                  </TouchableOpacity>
                  {!isDagOnlyWallet &&  (
                    <TouchableOpacity style={styles.buttonContainer} onPress={onSwapPressed} activeOpacity={0.7}>
                      <LinearGradient
                        useAngle
                        angle={180}
                        style={styles.button}
                        locations={[0, 1]}
                        colors={['#7150E2', '#4B22D3']}
                      >
                      <TextV3.LabelSemiStrong extraStyles={styles.buttonLabel}>
                        {SWAP_STRING}
                      </TextV3.LabelSemiStrong>
                    </LinearGradient>
                  </TouchableOpacity>
                  )}
                </View>
              }
            </View>
            <AssetsPanel />
          </>
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator
              size={ACTIVITY_INDICATOR_SIZE}
              color={ACTIVITY_INDICATOR_COLOR}
            />
          </View>
        )}
      </ScrollView>
      <Sheet
        isVisible={isWalletSelectorOpen}
        onClosePress={() => setIsWalletSelectorOpen(false)}
        height="65%"
        title={{
          label: 'Wallets',
          align: 'left',
        }}
      >
        <WalletsModal
          multiChainWallets={multiChainWallets}
          privateKeyWallets={privateKeyWallets}
          activeWallet={activeWallet}
          handleSwitchWallet={handleSwitchWallet}
        />
      </Sheet>
    </View>
  );
};

export default Home;
