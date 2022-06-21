///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { ScrollView, ActivityIndicator, View, Text } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
const ACTIVITY_INDICATOR_SIZE = 'small';

const AssetList: FC<IAssetList> = ({ constellationAssets, erc20Assets, handleAddCustomToken }) => {

  const renderAssetList = () => {

    return (
      <>
        {constellationAssets ? constellationAssets.map((key: string) => {
          return (
            <TextV3.Caption>Asset item</TextV3.Caption>)
        }) : <View style={styles.errorContainer}><TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>There was an error loading assets. Please try again later.</TextV3.Caption></View>}
      </>
    );
  };
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
      {false ? <ActivityIndicator style={styles.loadingContainer} size={ACTIVITY_INDICATOR_SIZE} /> : renderAssetList()}
    </ScrollView>
  );
};

export default AssetList;
