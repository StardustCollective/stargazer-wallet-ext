///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from 'react-native-size-matters';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';

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
import {
  setBiometryType,
  setBiometryAvailable,
  setBiometryEnabled,
  setAutoLogin,
  setInitialCheck,
} from 'state/biometrics';
import { iosPlatform } from 'utils/platform';

///////////////////////////
// Constants
///////////////////////////

const LOGO_IMAGE_WIDTH = 192;
const LOGO_IMAGE_HEIGTH = 166;
const EXTRA_SCROLL_HEIGHT = scale(60);

// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';
const LOGIN_ERROR_STRING = 'Error: Invalid password';

//////////////////////
// Types
//////////////////////

import ILogin from './types';
import { COLORS } from 'assets/styles/_variables.native';

const Login: FC<ILogin> = ({
  control,
  importClicked,
  handleSubmit,
  onSubmit,
  errors,
  register,
  isInvalid,
  isLoading,
  bioLoginLoading,
}) => {
  const {
    enabled: isBiometricEnabled,
    biometryType,
    autoLogin,
    initialCheck,
  } = useSelector((state: RootState) => state.biometrics);

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
    };
    checkBiometryAndLogin();
  }, []);

  const loginWithBiometrics = async () => {
    const biometryType = await Biometrics.getBiometryType();
    if (biometryType) {
      if (isBiometricEnabled) {
        const keyExist = await Biometrics.keyExists();
        if (keyExist) {
          try {
            const { success, signature, secret } = await Biometrics.createSignature(
              PROMPT_TITLES.signIn
            );
            const publicKey = await Biometrics.getPublicKeyFromKeychain();
            if (success && signature && secret && publicKey) {
              const verified = await Biometrics.verifySignature(
                signature,
                secret,
                publicKey
              );
              if (verified) {
                let password = await Biometrics.getUserPasswordFromKeychain();
                if (password) {
                  onSubmit({ password }, true);
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
        console.log('Biometric is disabled.');
      }
    } else {
      console.log('Biometric is not available.');
    }
  };

  const storePasswordInKeychain = async (password: string): Promise<void> => {
    const storedPassword = await Biometrics.getUserPasswordFromKeychain();

    // Password already stored
    if (storedPassword) return;

    await Biometrics.setUserPasswordInKeychain(password);
  };

  const getRightIconProps = () => {
    let iconProps = {};

    if (!biometryType) return iconProps;

    let rightIconComponent;

    if (biometryType === 'Face ID') {
      rightIconComponent = <FaceIdIcon width={24} />;
    } else if (biometryType === 'Touch ID' || biometryType === 'Touch ID/Face ID') {
      rightIconComponent = <TouchIdIcon width={24} />;
    }

    iconProps = {
      rightIconContainerStyle: {
        paddingRight: 4,
      },
      rightIcon: (
        <TouchableOpacity style={styles.iconContainer} onPress={loginWithBiometrics}>
          {rightIconComponent}
        </TouchableOpacity>
      ),
    };

    return iconProps;
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.layout}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextV3.HeaderLargeRegular align={TEXT_ALIGN_ENUM.CENTER}>
          Welcome to {'\n'} <TextV3.HeaderLarge>Stargazer Wallet</TextV3.HeaderLarge>
        </TextV3.HeaderLargeRegular>
        <Logo width={LOGO_IMAGE_WIDTH} height={LOGO_IMAGE_HEIGTH} style={styles.logo} />
        <View style={styles.input}>
          <TextInput
            id="createPass-password"
            type="password"
            name="password"
            placeholder={PLEASE_ENTER_YOUR_PASSWORD_STRING}
            control={control}
            {...getRightIconProps()}
          />
          <View style={styles.errorContainer}>
            {errors.password ? (
              <TextV3.CaptionStrong color={COLORS_ENUMS.RED}>
                {errors.password.message}
              </TextV3.CaptionStrong>
            ) : (
              isInvalid && (
                <TextV3.CaptionStrong color={COLORS_ENUMS.RED}>
                  {LOGIN_ERROR_STRING}
                </TextV3.CaptionStrong>
              )
            )}
          </View>
        </View>
        <View style={styles.unlockButtonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            title={UNLOCK_STRING}
            extraStyles={styles.unlockButton}
            extraTitleStyles={styles.unlockTitle}
            loading={isLoading}
            onPress={handleSubmit((data) => {
              onSubmit(data, false, storePasswordInKeychain);
            })}
          />
        </View>
      </ScrollView>
      <View style={styles.recoverContainer}>
        <Link
          color="monotoneOne"
          title="Recover from seed phrase"
          extraStyles={styles.recoveryButton}
          onPress={importClicked}
        />
      </View>
      <Modal
        animationType="none"
        transparent
        visible={bioLoginLoading}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <ActivityIndicator
            size={iosPlatform() ? 'large' : 90}
            color={COLORS.purple_medium}
          />
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default Login;
