///////////////////////////
// Modules
///////////////////////////

import React, { FC } from "react";
import { View, Image } from 'react-native';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Link from 'components/Link';

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

const Start: FC<IStart> = ({
  onGetStartedClicked,
  onImportClicked
}) => {
  return (
    <View style={styles.layout}>
      <TextV3.HeaderLarge
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        Welcome to {'\n'} Stargazer Wallet
      </TextV3.HeaderLarge>
      <Logo
        width={LOGO_IMAGE_SIZE}
        height={LOGO_IMAGE_SIZE}
        style={styles.logo}
      />
      <ButtonV3
        type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
        size={BUTTON_SIZES_ENUM.LARGE}
        title={'Get Started'}
        extraStyle={styles.started}
        onPress={onGetStartedClicked}
      />
      <Link
        color="monotoneOne"
        onPress={onImportClicked}
        title="Import from recovery seed phrase"
      />
    </View>
  );
};

export default Start;
