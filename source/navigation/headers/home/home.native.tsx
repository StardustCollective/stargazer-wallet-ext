///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import { 
  View,
  HamburgerIcon, 
  Pressable,
  Image,
  Icon
} from "native-base"


///////////////////////////
// Images
///////////////////////////

// require('assets/images/logo.svg')

import LogoImage from 'assets/images/logo.svg';

// import IconButton from '@material-ui/core/IconButton';

// import MenuIcon from '@material-ui/icons/Menu';

///////////////////////////
// Screens
///////////////////////////

import screens from 'navigation/screens';

///////////////////////////
// Styles
///////////////////////////

// import styles from './styles.scss';
// import commonStyles from './../styles.scss';

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