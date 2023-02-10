///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from 'react-native-size-matters';
import Biometrics from 'utils/biometrics';

///////////////////////////
// Components
///////////////////////////

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Link from 'components/Link';
import TextInput from 'components/TextInput';
import FaceIdIcon from 'assets/images/svg/face-id.svg';
import TouchIdIcon from 'assets/images/svg/touch-id.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

///////////////////////////
// Images
///////////////////////////

import Logo from 'assets/images/logo';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Utils
///////////////////////////

import store, { RootState } from 'state/store';
import { setBiometryType, setBiometryAvailable, setBiometryEnabled, setAutoLogin, setInitialCheck } from 'state/biometrics';

///////////////////////////
// Constants
///////////////////////////

const LOGO_IMAGE_SIZE = 192;
const EXTRA_SCROLL_HEIGHT = scale(25);

// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';
const LOGIN_ERROR_STRING = 'Error: Invalid password';

//////////////////////
// Types
//////////////////////

import ILogin from './types';

const Login: FC<ILogin> = ({ control, importClicked, handleSubmit, onSubmit, errors, register, isInvalid, isLoading }) => {
  const { enabled: isBiometricEnabled, biometryType, autoLogin, initialCheck } = useSelector((state: RootState) => state.biometrics);

  // Initial signature to show permission dialog
  useEffect(() => {
    const createSignatureAndVerify = async () => {
      try {
        await Biometrics.createKeys();
        const { success, signature, secret } = await Biometrics.createSignature();
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
  

  // Automatically login with biometrics if enabled
  useEffect(() => {
    const checkBiometryAndLogin = async () => {
      const bioType = await Biometrics.getBiometryType();
      const isAvailable = !!bioType;
      const type = !!bioType ? bioType : null;
      store.dispatch(setBiometryAvailable(isAvailable));
      store.dispatch(setBiometryType(type));
      if (isAvailable && isBiometricEnabled && autoLogin) {
        loginWithBiometrics();
      }
      store.dispatch(setAutoLogin(true));
    }
    checkBiometryAndLogin();
  }, []);

  const loginWithBiometrics = async () => {
    const biometryType = await Biometrics.getBiometryType();
    if (biometryType) {
      if (isBiometricEnabled) {
        const keyExist = await Biometrics.keyExists();
        if (keyExist) {
          try {
            const { success, signature, secret } = await Biometrics.createSignature();
            const publicKey = await Biometrics.getPublicKeyFromKeychain();
            if (success && signature && secret && publicKey) {
              const verified = await Biometrics.verifySignature(signature, secret, publicKey);
              if (verified) {
                let password = await Biometrics.getUserPasswordFromKeychain();
                if (password) {
                  onSubmit({ password }, false); 
                }
                password = null;
              }
            }
          } catch (err) {
            console.log('Biometric login failed', err);
          }
        }
      } else {
        Alert.alert('', `Sign in to turn on ${biometryType}`);
        console.log('Biometric is disabled.')
      }
    } else {
      console.log('Biometric is not available.');
    }
  }

  const storePasswordInKeychain = async (password: string): Promise<void> => {
    const storedPassword = await Biometrics.getUserPasswordFromKeychain();
    
    // Password already stored
    if (storedPassword) return;

    await Biometrics.setUserPasswordInKeychain(password);
  }

  const getRightIconProps = () => {
    let iconProps = {};

    if (!biometryType) return iconProps;

    let rightIconComponent;

      if (biometryType === 'Face ID' || biometryType === 'Touch ID/Face ID') {
        rightIconComponent = <FaceIdIcon width={24} />;
      } else if (biometryType === 'Touch ID') {
        rightIconComponent = <TouchIdIcon width={24} />;
      }

    iconProps = {
      rightIconContainerStyle: {
        paddingRight: 4,
      },
      rightIcon: <TouchableOpacity style={styles.iconContainer} onPress={loginWithBiometrics}>{rightIconComponent}</TouchableOpacity>,
    }


    return iconProps;
  }
  
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.layout}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextV3.HeaderLarge align={TEXT_ALIGN_ENUM.CENTER}>Welcome to {'\n'} Stargazer Wallet</TextV3.HeaderLarge>
        <Logo width={LOGO_IMAGE_SIZE} height={LOGO_IMAGE_SIZE} style={styles.logo} />
        <View style={styles.input}>
          <TextInput
            id="createPass-password"
            type="password"
            name="password"
            placeholder={PLEASE_ENTER_YOUR_PASSWORD_STRING}
            control={control}
            {...getRightIconProps()}
          />
          {errors.password ? (
            <TextV3.CaptionStrong color={COLORS_ENUMS.RED}>{errors.password.message}</TextV3.CaptionStrong>
          ) : (
            isInvalid && <TextV3.CaptionStrong color={COLORS_ENUMS.RED}>{LOGIN_ERROR_STRING}</TextV3.CaptionStrong>
          )}
        </View>

        <ButtonV3
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={UNLOCK_STRING}
          extraStyles={styles.unlockButton}
          loading={isLoading}
          onPress={handleSubmit((data) => {
            onSubmit(data, true, storePasswordInKeychain);
          })}
        />
        <Link extraStyles={styles.recoveryButton} color="monotoneOne" onPress={importClicked} title="Reset and restore from recovery seed phrase" />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default Login;
