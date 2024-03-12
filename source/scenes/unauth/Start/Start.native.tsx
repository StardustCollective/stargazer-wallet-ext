///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import store, { RootState } from 'state/store';

///////////////////////////
// Utils
///////////////////////////

import { iosPlatform } from 'utils/platform';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import {
  setBiometryType,
  setBiometryAvailable,
  setBiometryEnabled,
  setInitialCheck,
} from 'state/biometrics';

///////////////////////////
// Images
///////////////////////////

import Logo from 'assets/images/logo';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import IStart from './types';

///////////////////////////
// Constants
///////////////////////////

const LOGO_IMAGE_WIDTH = 192;
const LOGO_IMAGE_HEIGHT = 166;

///////////////////////////
// Scene
///////////////////////////

const Start: FC<IStart> = ({ navigation, onGetStartedClicked, onImportClicked }) => {
  const { initialCheck } = useSelector((state: RootState) => state.biometrics);

  useEffect(() => {
    // This is set only for the scenario where an user deletes the last wallet.
    // In that case we're navigating to this screen and we should disable the swipe back functionality.
    navigation.setOptions({ gestureEnabled: false });
    navigation.getParent()?.setOptions({ gestureEnabled: false });

    // Android back button handler
    const hardwareBackPressHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent default behavior of leaving the screen
        return true;
      }
    );

    return () => {
      navigation.setOptions({ gestureEnabled: true });
      navigation.getParent()?.setOptions({ gestureEnabled: true });
      hardwareBackPressHandler.remove();
    };
  }, [navigation]);

  // Initial signature to show permission dialog
  useEffect(() => {
    const createSignatureAndVerify = async () => {
      try {
        await Biometrics.createKeys();
        const { success, signature, secret } = await Biometrics.createSignature(
          PROMPT_TITLES.auth
        );
        const publicKey = await Biometrics.getPublicKeyFromKeychain();
        if (success && signature && secret && publicKey) {
          const verified = await Biometrics.verifySignature(signature, secret, publicKey);
          if (verified) {
            store.dispatch(setBiometryEnabled(false));
          }
        }
      } catch (err) {
        console.log('Biometric signature verification failed', err);
      }
    };
    if (iosPlatform() && initialCheck) {
      store.dispatch(setInitialCheck(false));
      createSignatureAndVerify();
    }
  }, []);

  // Check if device supports biometrics
  useEffect(() => {
    const checkBiometrics = async () => {
      const bioType = await Biometrics.getBiometryType();
      const isAvailable = !!bioType;
      const type = bioType || null;
      store.dispatch(setBiometryAvailable(isAvailable));
      store.dispatch(setBiometryType(type));
    };

    checkBiometrics();
  }, []);

  return (
    <View style={styles.layout}>
      <TextV3.HeaderLargeRegular align={TEXT_ALIGN_ENUM.CENTER}>
        Welcome to {'\n'} <TextV3.HeaderLarge>Stargazer Wallet</TextV3.HeaderLarge>
      </TextV3.HeaderLargeRegular>
      <Logo width={LOGO_IMAGE_WIDTH} height={LOGO_IMAGE_HEIGHT} style={styles.logo} />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        extraStyles={styles.createWalletButton}
        extraTitleStyles={styles.createWalletButtonText}
        title="Create new wallet"
        onPress={onGetStartedClicked}
      />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
        size={BUTTON_SIZES_ENUM.LARGE}
        extraStyles={styles.restoreButton}
        extraTitleStyles={styles.restoreButtonText}
        title="Restore Stargazer wallet"
        onPress={onImportClicked}
      />
    </View>
  );
};

export default Start;
