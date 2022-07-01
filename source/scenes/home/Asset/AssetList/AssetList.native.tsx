///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import AssetWithToggle from 'components/AssetWithToggle';
import SearchInput from 'components/SearchInput';

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

const ACTIVITY_INDICATOR_SIZE = 'small';

const AssetList: FC<IAssetList> = ({ assets, allAssets, loading, toggleAssetItem, searchValue, onSearch }) => {

  const renderAssetItem = ({ item }) => {
    const selected = !!assets[item.id];
    const disabled = ['constellation', 'ethereum'].includes(item.id);
    return <AssetWithToggle 
              id={item.id}
              symbol={item.symbol} 
              logo={item.logo} 
              label={item.label} 
              selected={selected} 
              disabled={disabled}
              toggleItem={(value) => toggleAssetItem(item, value)} />;
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <>
      <View style={styles.searchContainer}>
        <SearchInput value={searchValue} onChange={onSearch} />
      </View>
      {
        loading ? 
        <ActivityIndicator style={styles.loadingContainer} size={ACTIVITY_INDICATOR_SIZE} /> : 
        <FlatList 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
          data={allAssets}
          keyExtractor={(item, index) => item + index}
          renderItem={renderAssetItem}
          initialNumToRender={20}
        />
      }
    </>
  );
};

export default AssetList;
