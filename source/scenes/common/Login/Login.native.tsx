///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Link from 'components/Link';
import TextInput from 'components/TextInput';

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
// Constants
///////////////////////////

const LOGO_IMAGE_SIZE = 192;

// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';
const LOGIN_ERROR_STRING = 'Error: Invalid password';

//////////////////////
// Types
//////////////////////

import ILogin from './types';

const Login: FC<ILogin> = ({ control, importClicked, handleSubmit, onSubmit, errors, register, isInvalid, isLoading }) => {
  return (
    <KeyboardAvoidingView style={styles.layout} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={10}>
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
            onSubmit(data);
          })}
        />
        <Link extraStyles={{ fontSize: 12, marginBottom: 10 }} color="monotoneOne" onPress={importClicked} title="Reset and restore from recovery seed phrase" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
