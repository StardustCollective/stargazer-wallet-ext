import React, { FC } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { NFTListProps } from './types';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaNFT } from 'state/nfts/types';
import { COLORS } from 'assets/styles/_variables';
import { NEW_COLORS } from 'assets/styles/_variables.native';
import styles from './styles';
import { NO_NFTS_FOUND, SEARCH_PLACEHOLDER } from './constants';

const NFTList: FC<NFTListProps> = ({
  selectedCollection,
  data,
  hasItems,
  searchValue,
  onPressNFT,
  onSearch,
}) => {
  const showLoading = false;
  const showEmptyList = !data.length && !hasItems;
  const showNFTList = !!data?.length || hasItems;

  const renderNftItem = ({ item }: { item: IOpenSeaNFT }) => {
    const nftLogo = !!item.image_url ? item.image_url : selectedCollection.image_url;
    return (
      <CardNFT
        title={item.name}
        subtitle={'1'}
        logo={nftLogo}
        chain={selectedCollection.chain}
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
      <View style={styles.noDataContainer}>
        <ActivityIndicator color={COLORS.purple_medium} size="large" />
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
          />
        </View>
        {!!data?.length ? (
          <FlatList
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
