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
import { IAssetInfoState } from 'state/assets/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
const ACTIVITY_INDICATOR_SIZE = 'small';

const BuyList: FC<IBuyList> = ({ assets, loading, handleSelectAsset }) => {
  const renderAssetList = () => {
    return (
      <>
        {assets ? (
          assets.map((asset: IAssetInfoState) => {
            return (
              <AssetItem
                id={asset.id}
                key={asset.id}
                asset={asset}
                assetInfo={asset}
                itemClicked={() => handleSelectAsset(asset)}
              />
            );
          })
        ) : (
          <View style={styles.errorContainer}>
            <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
              There was an error loading assets. Please try again later.
            </TextV3.Caption>
          </View>
        )}
      </>
    );
  };
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      {loading ? (
        <ActivityIndicator
          style={styles.loadingContainer}
          size={ACTIVITY_INDICATOR_SIZE}
        />
      ) : (
        renderAssetList()
      )}
    </ScrollView>
  );
};

export default BuyList;
