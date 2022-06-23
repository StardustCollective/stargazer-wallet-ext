///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, Text } from 'react-native';

///////////////////////////
// Types
///////////////////////////

import IAddCustomAsset from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const AddCustomAsset: FC<IAddCustomAsset> = () => {

  ///////////////////////////
  // Render
  ///////////////////////////
  
  return (
    <View style={styles.container}>
      <Text>Add Custom Asset</Text>
    </View>
  );
};

export default AddCustomAsset;
