///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

///////////////////////////
// Components
///////////////////////////

import AssetWithToggle from 'components/AssetWithToggle';
import SearchInput from 'components/SearchInput';

///////////////////////////
// Utils
///////////////////////////

import { getKeyringAssetType } from 'utils/keyringUtil';
import {
  getNetworkFromChainId,
  getNetworkLabel,
  getNetworkLogo,
} from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { NEW_COLORS } from '../../../../assets/styles/_variables.native';
import { CONSTELLATION_LOGO } from 'constants/index';

///////////////////////////
// Constants
///////////////////////////

const ACTIVITY_INDICATOR_SIZE = 'small';

const AssetList: FC<IAssetList> = ({
  activeNetworkAssets,
  allAssets,
  loading,
  toggleAssetItem,
  searchValue,
  onSearch,
  activeWallet,
  activeNetwork,
}) => {
  const renderAssetItem = ({ item }: { item: IAssetInfoState }) => {
    const selected = !!activeNetworkAssets?.find((asset) => asset?.id === item?.id);
    const itemType = getKeyringAssetType(item?.type);
    const disabled = [AssetType.Constellation, AssetType.Ethereum].includes(item?.id);
    const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
    const itemChainId = item?.network;
    const itemNetwork =
      item?.type === AssetType.Constellation
        ? KeyringNetwork.Constellation
        : getNetworkFromChainId(itemChainId);
    const currentActiveNetwork = activeNetwork[itemNetwork];
    const networkLabel = getNetworkLabel(currentActiveNetwork);
    const networkLogo =
      item?.type === AssetType.Constellation
        ? CONSTELLATION_LOGO
        : getNetworkLogo(itemChainId);
    // 349: New network should be added here.
    const isMATIC = item?.id === AssetType.Polygon && itemChainId === 'matic';
    const isAVAX =
      item?.id === AssetType.Avalanche && itemChainId === 'avalanche-mainnet';
    const isBNB = item?.id === AssetType.BSC && itemChainId === 'bsc';
    const isBase = item?.id === AssetType.Base && itemChainId === 'base-mainnet';
    const hideToken =
      itemChainId !== 'both' &&
      !isMATIC &&
      !isAVAX &&
      !isBNB &&
      !isBase &&
      currentActiveNetwork !== itemChainId;
    if (!isAssetSupported || hideToken) return null;
    return (
      <AssetWithToggle
        id={item?.id}
        symbol={item?.symbol}
        networkLogo={networkLogo}
        networkLabel={networkLabel}
        logo={item?.logo}
        label={item?.label}
        selected={selected}
        disabled={disabled}
        toggleItem={(value) => toggleAssetItem(item, value)}
      />
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <>
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchValue}
          onChange={onSearch}
          extraStyles={{ borderColor: NEW_COLORS.primary_lighter_1 }}
        />
      </View>
      {loading ? (
        <ActivityIndicator
          style={styles.loadingContainer}
          size={ACTIVITY_INDICATOR_SIZE}
        />
      ) : (
        <FlatList
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
          data={allAssets}
          keyExtractor={(item, index) => item + index}
          renderItem={renderAssetItem}
          initialNumToRender={20}
        />
      )}
    </>
  );
};

export default AssetList;
