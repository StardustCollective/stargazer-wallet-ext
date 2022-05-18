///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import AssetItem from 'components/AssetItem';
import TextV3 from 'components/TextV3';

///////////////////////////
// Types
///////////////////////////

import { IBuyList } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
const ACTIVITY_INDICATOR_SIZE = 'small';

const BuyList: FC<IBuyList> = ({ supportedAssets, handleSelectAsset }) => {

  const renderAssetList = () => {
    const assets = supportedAssets?.data;

    return (
      <>
        {assets ? Object.keys(assets).map((key: string) => {
          return (
            <AssetItem
              id={assets[key].id}
              key={assets[key].id}
              asset={assets[key]}
              assetInfo={assets[key]}
              itemClicked={() => handleSelectAsset(assets[key].id)}
            />
          );
        }) : <View style={styles.errorContainer}><TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>There was an error loading assets. Please try again later.</TextV3.Caption></View>}
      </>
    );
  };
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
      {supportedAssets?.loading ? <ActivityIndicator style={styles.loadingContainer} size={ACTIVITY_INDICATOR_SIZE} /> : renderAssetList()}
    </ScrollView>
  );
};

export default BuyList;
