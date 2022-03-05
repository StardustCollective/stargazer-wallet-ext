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

///////////////////////////
// Component
///////////////////////////

const Container: FC<IContainer> = (
  {
    children,
    safeArea = true,
  }
) => {

  const AreaView = safeArea? SafeAreaView : View;

  return (
    <View style={styles.container}>
      <AreaView style={styles.safeArea}>
        {children}
      </AreaView>
    </View>
  )
}

export default Container;