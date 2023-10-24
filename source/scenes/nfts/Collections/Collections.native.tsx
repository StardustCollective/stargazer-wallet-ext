import React, { FC } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { CollectionsProps } from './types';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaCollectionWithChain } from 'state/nfts/types';
import { COLORS } from 'assets/styles/_variables';
import styles from './styles';
import { NEW_COLORS } from 'assets/styles/_variables.native';
import { NFTS_NOT_FOUND, SEARCH_PLACEHOLDER } from './constants';

const Collections: FC<CollectionsProps> = ({
  collections,
  onPressCollection,
  searchValue,
  onSearch,
  hasItems,
}) => {
  const { data, error, loading } = collections;

  const showLoading = loading;
  const showEmptyList = (!!data && !Object.keys(data).length && !hasItems) || !!error;
  const showCollectionList = (!!data && Object.keys(data).length) || hasItems;

  const renderCollectionItem = ({ item }: { item: IOpenSeaCollectionWithChain }) => {
    const collectionLogo = !!item.image_url ? item.image_url : item.nfts[0].image_url;

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
      <View style={styles.noDataContainer}>
        <ActivityIndicator color={COLORS.purple_medium} size="large" />
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
          />
        </View>
        {hasItems ? (
          <FlatList
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
