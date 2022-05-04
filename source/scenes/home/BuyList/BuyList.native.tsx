///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { ScrollView } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import AssetsPanel from 'scenes/home/Home/AssetsPanel';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const BuyList: FC = () => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
      <AssetsPanel showNFTs={false} />
    </ScrollView>
  );
};

export default BuyList;
