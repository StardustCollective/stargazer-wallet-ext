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


///////////////////////////
// Images
///////////////////////////

import LogoImage from 'assets/images/logo.svg';

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
    navigation.navigate(screens.authorized.settings)
  }

  const renderHeaderRight = () => {

    if (hasMainAccount) {
      return (
      <Pressable
        onPress={onMenuButtonClicked}
      >
        <HamburgerIcon testId="header-moreButton" color="white" mr="15px" />
      </Pressable>)
    }
    // Hack: The header title will not center unless there is 
    // both a headerLeft and headerRight. So we insert an 
    // empty View to meet the requirement.
    return (<View m='1'></View>);

  }

  return {
    ...config,
    headerLeft: () => (
      <View ml="15px">
        <LogoImage width={30} height={30}/>
      </View>

    ),
    headerRight: () => renderHeaderRight(),
  }
};

export default homeHeader;