///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import {
  View,
  HamburgerIcon,
  Pressable,
} from "native-base"
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
// Screens
///////////////////////////

import screens from 'navigation/screens';

///////////////////////////
// Interfaces
///////////////////////////

interface IHomeHeader {
  navigation: any;
  hasMainAccount: boolean;
}

///////////////////////////
// Header
///////////////////////////

const homeHeader = ({
  navigation,
  hasMainAccount
}: IHomeHeader) => {

  const onMenuButtonClicked = () => {
    navigation.navigate(screens.settings.main)
  }

  const renderHeaderRight = () => {

    return (
      <Pressable
        onPress={onMenuButtonClicked}
        mr="5"
      >
        <HamburgerIcon testId="header-moreButton" color="white" />
      </Pressable>
    );


  }

  return {
    ...config,
    headerLeft: () => (
      <View style={styles.logo}>
        <LogoImage width={scale(30)} height={scale(30)} />
      </View>

    ),
    headerRight: () => renderHeaderRight(),
  }
};

export default homeHeader;