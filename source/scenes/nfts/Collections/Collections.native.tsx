import React, { FC, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { CollectionsProps } from './types';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import LoadingList from '../LoadingList';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaCollectionWithChain } from 'state/nfts/types';
import { NEW_COLORS } from 'assets/styles/_variables.native';
import { NFTS_NOT_FOUND, SEARCH_PLACEHOLDER } from './constants';
import { PLACEHOLDER_IMAGE } from 'constants/index';
import styles from './styles';

const Collections: FC<CollectionsProps> = ({
  collections,
  onPressCollection,
  searchValue,
  onSearch,
  onRefresh,
  hasItems,
}) => {
  const { data, error, loading } = collections;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const showLoading = loading && !isRefreshing;
  const showEmptyList = (!!data && !Object.keys(data).length && !hasItems) || !!error;
  const showCollectionList = (!!data && Object.keys(data).length) || hasItems;

  const onPullRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const renderCollectionItem = ({ item }: { item: IOpenSeaCollectionWithChain }) => {
    const collectionLogo = !!item?.image_url
      ? item.image_url
      : !!item?.nfts[0]?.image_url
      ? item.nfts[0].image_url
      : PLACEHOLDER_IMAGE;

    return (
      <CardNFT
        title={item.name}
        subtitle={item.nfts.length}
        logo={collectionLogo}
        chain={item.chain}
        onPress={() => onPressCollection(item)}
      />
    );
  };

  const renderNoNfts = () => {
    return (
      <View style={styles.noDataContainer}>
        <StargazerCard height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NFTS_NOT_FOUND}
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

  if (showCollectionList) {
    const hasItems = !!Object.values(data).length;
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
        {hasItems ? (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={NEW_COLORS.primary_lighter_1}
                colors={[NEW_COLORS.primary_lighter_1]}
                refreshing={loading || isRefreshing}
                onRefresh={onPullRefresh}
              />
            }
            data={Object.values(data)}
            renderItem={renderCollectionItem}
            numColumns={2}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(item: IOpenSeaCollectionWithChain) => item.collection}
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

export default Collections;
