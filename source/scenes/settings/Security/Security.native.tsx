///////////////////////
// Modules
///////////////////////

import React from 'react';
import { View, Switch } from 'react-native';
import { useSelector } from 'react-redux';

///////////////////////
// Utils
///////////////////////

import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import store, { RootState } from 'state/store';
import { setBiometryEnabled } from 'state/biometrics';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables.native';

const Security = () => {
  const { enabled, biometryType } = useSelector((state: RootState) => state.biometrics);

  const toggleBiometrics = async () => {
    if (enabled) {
      // Disable and remove keys
      store.dispatch(setBiometryEnabled(false));
      await Biometrics.deleteKeys();
    } else {
      // Enable and create keys
      store.dispatch(setBiometryEnabled(true));
      try {
        await Biometrics.createKeys();
        const { success, signature, secret } = await Biometrics.createSignature(
          PROMPT_TITLES.auth
        );
        const publicKey = await Biometrics.getPublicKeyFromKeychain();
        if (success && signature && secret && publicKey) {
          const verified = await Biometrics.verifySignature(signature, secret, publicKey);
          if (!verified) {
            store.dispatch(setBiometryEnabled(false));
          }
        } else {
          store.dispatch(setBiometryEnabled(false));
        }
      } catch (err) {
        store.dispatch(setBiometryEnabled(false));
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          Allow {biometryType}
        </TextV3.CaptionStrong>
        <Switch
          value={enabled}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.purple_light}
          trackColor={{ true: COLORS.primary_lighter_1, false: COLORS.purple_light }}
          onValueChange={toggleBiometrics}
        />
      </View>
    </View>
  );
};

export default Security;
