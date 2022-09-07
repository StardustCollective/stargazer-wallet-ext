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
import { getNetworkFromChainId, getNetworkLabel } from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';
import { AssetSymbol } from 'state/vault/types';

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
    const disabled = [AssetSymbol.DAG, AssetSymbol.ETH].includes(item?.symbol);
    const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
    const itemChainId = item?.network;
    const itemNetwork = getNetworkFromChainId(itemChainId);
    const currentActiveNetwork = activeNetwork[itemNetwork];
    const network = getNetworkLabel(currentActiveNetwork, item?.symbol);
    // TODO-349: Only Polygon and AVAX. Add isBNB
    const isMATIC = item?.symbol === AssetSymbol.MATIC && itemChainId === 'matic';
    const isAVAX = item?.symbol === AssetSymbol.AVAX && itemChainId === 'avalanche-mainnet';
    const hideToken = itemChainId !== 'both' && !isMATIC && !isAVAX && currentActiveNetwork !== itemChainId;
    if (!isAssetSupported || hideToken) return null;
    return <AssetWithToggle 
              id={item?.id}
              symbol={item?.symbol} 
              network={network}
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
