///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import config from '../config';
import { View } from 'native-base';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Images
///////////////////////////

import LogoImage from 'assets/images/logo.svg';
import RestartIcon from 'assets/images/svg/restart.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Header
///////////////////////////

interface INftsHeader {
  onRefresh: () => void;
}

const nftsHeader = ({ onRefresh }: INftsHeader) => {
  const renderHeaderRight = () => {
    return (
      <TouchableOpacity style={styles.rightIconContainer} onPress={onRefresh}>
        <RestartIcon />
      </TouchableOpacity>
    );
  };

  return {
    ...config,
    headerLeft: () => (
      <View style={styles.logo}>
        <LogoImage width={scale(28)} height={scale(28)} />
      </View>
    ),
    headerRight: renderHeaderRight,
  };
};

export default nftsHeader;
