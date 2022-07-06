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
// Utils
///////////////////////////

import { getKeyringAssetType } from 'utils/keyringUtil';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';
import { KeyringAssetType } from "@stardust-collective/dag4-keyring";

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

const ACTIVITY_INDICATOR_SIZE = 'small';

const AssetList: FC<IAssetList> = ({ activeNetworkAssets, allAssets, loading, toggleAssetItem, searchValue, onSearch, activeWallet, activeNetwork }) => {

  const renderAssetItem = ({ item }: { item: IAssetInfoState }) => {
    const selected = !!activeNetworkAssets?.find(asset => asset?.id === item?.id);
    const itemType = getKeyringAssetType(item?.type);
    const disabled = [KeyringAssetType.DAG, KeyringAssetType.ETH].includes(itemType);
    const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
    const differentNetwork = item?.network !== 'both' && activeNetwork.Ethereum !== item?.network;
    if (!isAssetSupported || differentNetwork) return null;
    return <AssetWithToggle 
              id={item?.id}
              symbol={item?.symbol} 
              logo={item?.logo} 
              label={item?.label} 
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
