import React, { FC, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { NFTListProps } from './types';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import LoadingList from '../LoadingList';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaNFT } from 'state/nfts/types';
import { NEW_COLORS } from 'assets/styles/_variables.native';
import { formatNumber } from 'scenes/home/helpers';
import styles from './styles';
import { NO_NFTS_FOUND, SEARCH_PLACEHOLDER } from './constants';
import { PLACEHOLDER_IMAGE } from 'constants/index';

const NFTList: FC<NFTListProps> = ({
  loading,
  selectedCollection,
  data,
  hasItems,
  searchValue,
  onPressNFT,
  onSearch,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showLoading = loading && !isRefreshing;
  const showEmptyList = !data?.length && !hasItems;
  const showNFTList = !!data?.length || hasItems;

  const onPullRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const renderNftItem = ({ item }: { item: IOpenSeaNFT }) => {
    const nftLogo = !!item?.image_url ? item.image_url : PLACEHOLDER_IMAGE;
    const quantity = !isNaN(item.quantity) ? formatNumber(item.quantity, 0, 0) : '1';
    return (
      <CardNFT
        title={item.name}
        subtitle={quantity}
        logo={nftLogo}
        chain={selectedCollection?.chain}
        onPress={() => onPressNFT(item)}
      />
    );
  };

  const renderNoNfts = () => {
    return (
      <View style={styles.noDataContainer}>
        <StargazerCard height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NO_NFTS_FOUND}
        </TextV3.BodyStrong>
      </View>
    );
  };

  if (showLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={SEARCH_PLACEHOLDER}
            extraStyles={styles.searchInputContainer}
            editable={false}
          />
        </View>
        <LoadingList />
      </View>
    );
  }

  if (showEmptyList) {
    return <>{renderNoNfts()}</>;
  }

  if (showNFTList) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={SEARCH_PLACEHOLDER}
            value={searchValue}
            onChange={onSearch}
            extraStyles={styles.searchInputContainer}
            selectionColor={NEW_COLORS.primary_lighter_1}
            extraInputStyles={styles.searchInput}
            editable={true}
          />
        </View>
        {!!data?.length ? (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={NEW_COLORS.primary_lighter_1}
                colors={[NEW_COLORS.primary_lighter_1]}
                refreshing={loading || isRefreshing}
                onRefresh={onPullRefresh}
              />
            }
            data={data}
            renderItem={renderNftItem}
            numColumns={2}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(item: IOpenSeaNFT) => item.identifier}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          renderNoNfts()
        )}
      </View>
    );
  }

  return null;
};

export default NFTList;
