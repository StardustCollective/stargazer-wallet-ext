import React, { FC } from 'react';

import { View, Text, Linking, StyleSheet } from 'react-native';

///////////////////////
// Types
///////////////////////
import styles from './styles';

///////////////////////
// Types
///////////////////////
import IAboutSettings from './types';

const About: FC<IAboutSettings> = ({
  version,
  versionMajorMinor,
  supportLabel,
  supportLink,
  termsLabel,
  termsLink,
  privacyLabel,
  privacyLink,
}) => {
  const termsAndPrivacyStyles = StyleSheet.flatten([
    styles.text,
    styles.termsAndPrivacy,
  ]);

  const privacyStyles = StyleSheet.flatten([
    styles.text,
    styles.termsAndPrivacy,
    styles.privacy
  ]);
  return (
    <View style={styles.about}>
      <Text style={styles.text}>
        Stargazer Wallet Chrome Extension v{versionMajorMinor}
      </Text>
      <Text style={styles.text}>Version: {version}</Text>
      <Text style={styles.text}>
        Support:{' '}
        <Text style={styles.link} onPress={() => Linking.openURL(supportLink)}>
          {supportLabel}
        </Text>
      </Text>
      <Text style={termsAndPrivacyStyles}>Terms and Conditions:</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(termsLink)}>
        {termsLabel}
      </Text>
      <Text style={privacyStyles}>Privacy:</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(privacyLink)}>
        {privacyLabel}
      </Text>
    </View>
  );
};

export default About;
