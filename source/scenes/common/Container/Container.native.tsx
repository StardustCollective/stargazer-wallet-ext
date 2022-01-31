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
    children
  }
) => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
  )
}

export default Container;