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
        <ArrowBackIcon size="7" color="white" ml="5" />
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