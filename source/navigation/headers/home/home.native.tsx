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
import PlusImage from 'assets/images/svg/plus.svg';

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

interface IHomeHeader{
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

  const onPlusButtonClicked = () => {
    navigation.navigate(screens.authorized.addAsset);
  }

  const renderHeaderRight = () => {

    if (hasMainAccount) {
      return (
        <View style={styles.iconsContainer}>
          <Pressable
            onPress={onPlusButtonClicked}
            style={styles.plusContainer}
            mr="3">
              <PlusImage width={scale(15)} height={scale(15)} />
          </Pressable>
          <Pressable
            onPress={onMenuButtonClicked}
            mr="3"
          >
            <HamburgerIcon testId="header-moreButton" color="white"/>
          </Pressable>
        </View>
      )
    }
    // Hack: The header title will not center unless there is 
    // both a headerLeft and headerRight. So we insert an 
    // empty View to meet the requirement.
    return (<View m='1'></View>);

  }

  return {
    ...config,
    headerLeft: () => (
      <View style={styles.logo}>
        <LogoImage width={scale(30)} height={scale(30)}/>
      </View>

    ),
    headerRight: () => renderHeaderRight(),
  }
};

export default homeHeader;