///////////////////////
// Modules
///////////////////////

import React from 'react';
import { View, Switch } from 'react-native';
import { useSelector } from 'react-redux';

///////////////////////
// Utils
///////////////////////

import Biometrics from 'utils/biometrics';
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

const BIOMETRY_MAP = {
  'FaceID': 'Face ID',
  'TouchID': 'Touch ID',
  'Biometrics': 'Touch ID/Face ID',
}

const Security = () => {
  const { enabled, biometryType } = useSelector((state: RootState) => state.biometrics);

  const toggleBiometrics = async () => {
    store.dispatch(setBiometryEnabled(!enabled));
    if (enabled) {
      // Disable and remove keys
      await Biometrics.deleteKeys();
    } else {
      // Enable and create keys
      await Biometrics.createKeys();
      await Biometrics.createSignature();
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextV3.LabelSemiStrong color={COLORS_ENUMS.DARK_GRAY_200}>{BIOMETRY_MAP[biometryType]}</TextV3.LabelSemiStrong>
        <View style={styles.cardContainer}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>Allow {BIOMETRY_MAP[biometryType]}</TextV3.CaptionStrong>
            <Switch 
              value={enabled} 
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.purple_light}
              trackColor={{ true: COLORS.primary_lighter_1 , false: COLORS.purple_light }}
              onValueChange={toggleBiometrics}
            />
        </View>
      </View>
    </View>
  );
};

export default Security;
