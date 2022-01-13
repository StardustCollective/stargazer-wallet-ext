///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';

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
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  )
}

export default Container;