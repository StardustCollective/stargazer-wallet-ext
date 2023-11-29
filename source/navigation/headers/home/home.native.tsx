///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import { View } from 'native-base';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Images
///////////////////////////

import LogoImage from 'assets/images/logo.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Header
///////////////////////////

const homeHeader = () => {
  return {
    ...config,
    headerLeft: () => (
      <View style={styles.logo}>
        <LogoImage width={scale(28)} height={scale(28)} />
      </View>
    ),
  };
};

export default homeHeader;
