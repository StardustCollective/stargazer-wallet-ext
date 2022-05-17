///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import AssetItem from 'components/AssetItem';

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

const ACTIVITY_INDICATOR_SIZE = 'small';

const BuyList: FC<IBuyList> = ({ supportedAssets, handleSelectAsset }) => {

  const renderAssetList = () => {
    const assets = supportedAssets?.data;

    return (
      <>
        {assets && Object.keys(assets).map((key: string) => {
          return (
            <AssetItem
              id={assets[key].id}
              key={assets[key].id}
              asset={assets[key]}
              assetInfo={assets[key]}
              itemClicked={() => handleSelectAsset(assets[key].id)}
            />
          );
        })}
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
