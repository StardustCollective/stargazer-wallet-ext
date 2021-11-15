///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import { fade } from 'navigation/animations';
import { 
  View,
  ArrowBackIcon, 
  Pressable 
} from "native-base"

///////////////////////////
// Styles
///////////////////////////

// import IconButton from '@material-ui/core/IconButton';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';

///////////////////////////
// Styles
///////////////////////////

// import styles from './styles.scss';
// import commonStyles from './../styles.scss';

///////////////////////////
// Interfaces
///////////////////////////
interface IDefaultHeader {
  navigation: any
}

///////////////////////////
// Header
///////////////////////////

const defaultHeader = ({
  navigation,
}: IDefaultHeader) => {

  const onBackButtonClicked = () => {
    navigation.goBack();
  }

  const renderHeaderLeft = () => {

    return (
      <Pressable onPress={onBackButtonClicked}>
        <ArrowBackIcon size="7" m="3" color="white" />
      </Pressable>
    );
  }

  return {
    ...config,
    headerLeft: () => renderHeaderLeft(),
    headerRight: () => (
      <View></View>
    ),
    animationEnabled: true,
    cardStyleInterpolator: fade
  }
};

export default defaultHeader;