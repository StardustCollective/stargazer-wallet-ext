///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Link from 'components/Link';
import store, { RootState } from 'state/store';

///////////////////////////
// Utils
///////////////////////////

import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import { setBiometryType, setBiometryAvailable, setBiometryEnabled, setInitialCheck } from 'state/biometrics';

///////////////////////////
// Images
///////////////////////////

import Logo from 'assets/images/logo';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

const LOGO_IMAGE_SIZE = 192;

///////////////////////////
// Types
///////////////////////////

import IStart from './types';

///////////////////////////
// Scene
///////////////////////////

const Start: FC<IStart> = ({ onGetStartedClicked, onImportClicked }) => {
  const { initialCheck } = useSelector((state: RootState) => state.biometrics);

  // Initial signature to show permission dialog
  useEffect(() => {
    const createSignatureAndVerify = async () => {
      try {
        await Biometrics.createKeys();
        const { success, signature, secret } = await Biometrics.createSignature(PROMPT_TITLES.auth);
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
    }
    if (initialCheck) {
      store.dispatch(setInitialCheck(false));
      createSignatureAndVerify();
    }
  }, []);

  // Check if device supports biometrics
  useEffect(() => {
    const checkBiometrics = async () => {
      const bioType = await Biometrics.getBiometryType();
      const isAvailable = !!bioType;
      const type = !!bioType ? bioType : null;
      store.dispatch(setBiometryAvailable(isAvailable));
      store.dispatch(setBiometryType(type));
    }
    
    checkBiometrics();
  }, []);

  return (
    <View style={styles.layout}>
      <TextV3.HeaderLarge align={TEXT_ALIGN_ENUM.CENTER}>Welcome to {'\n'} Stargazer Wallet</TextV3.HeaderLarge>
      <Logo width={LOGO_IMAGE_SIZE} height={LOGO_IMAGE_SIZE} style={styles.logo} />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        title={'Get Started'}
        extraStyles={styles.started}
        onPress={onGetStartedClicked}
      />
      <Link color="monotoneOne" onPress={onImportClicked} title="Import from recovery seed phrase" />
    </View>
  );
};

export default Start;
