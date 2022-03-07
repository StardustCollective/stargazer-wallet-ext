///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { SafeAreaView, View } from 'react-native';

///////////////////////////
// Types
///////////////////////////

import IContainer from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS } from 'assets/styles/_variables';

///////////////////////////
// Enums
///////////////////////////

import { CONTAINER_COLOR } from './enum';

///////////////////////////
// Component
///////////////////////////

const Container: FC<IContainer> = (
  {
    children,
    safeArea = true,
    color = CONTAINER_COLOR.DARK,
  }
) => {

  const AreaView = safeArea ? SafeAreaView : View;

  let extraSafeAreaStyles = {};

  if (color === CONTAINER_COLOR.LIGHT) {
    extraSafeAreaStyles = {
      backgroundColor: COLORS.gray_light_100
    }
  } else if (color === CONTAINER_COLOR.DARK) {
    extraSafeAreaStyles = {
      backgroundColor: COLORS.primary
    }
  }

  return (
    <View style={[styles.container]}>
      <AreaView style={[styles.safeArea, extraSafeAreaStyles]}>
        {children}
      </AreaView>
    </View>
  )
}

export default Container;