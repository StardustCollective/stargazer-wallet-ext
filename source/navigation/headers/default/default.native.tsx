///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import ArrowLeftIcon from 'assets/images/svg/arrow-rounded-left.svg';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Pressable } from 'native-base';

///////////////////////////
// Interfaces
///////////////////////////
interface IDefaultHeader {
  navigation: any;
  onBackPressed: () => void;
}

///////////////////////////
// Header
///////////////////////////

const defaultHeader = ({ navigation, onBackPressed }: IDefaultHeader) => {
  const onBackButtonClicked = () => {
    navigation.goBack();
  };

  const renderHeaderLeft = () => {
    return (
      <Pressable
        style={{ marginLeft: 16 }}
        onPress={onBackPressed || onBackButtonClicked}
      >
        <ArrowLeftIcon width={24} />
      </Pressable>
    );
  };

  return {
    ...config,
    headerLeft: () => renderHeaderLeft(),
    headerRight: () => <View></View>,
    animationEnabled: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
};

export default defaultHeader;
