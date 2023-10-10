import React, { FC } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { CollectionsProps } from './types';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaCollectionWithChain } from 'state/nfts/types';
import { COLORS } from 'assets/styles/_variables';
import styles from './styles';

const Collections: FC<CollectionsProps> = ({ collections, onPressCollection }) => {
  const { data, error, loading } = collections;

  const showLoading = loading;
  const showEmptyList = (!!data && !Object.keys(data).length) || !!error;
  const showNFTList = !!data && Object.keys(data).length;

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

  if (showLoading) {
    return (
      <View style={styles.noDataContainer}>
        <ActivityIndicator color={COLORS.purple_medium} size="large" />
      </View>
    );
  }

  if (showEmptyList) {
    return (
      <View style={styles.noDataContainer}>
        <StargazerCard height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          No NFTs found
        </TextV3.BodyStrong>
      </View>
    );
  }

  if (showNFTList) {
    return (
      <View style={styles.container}>
        {/* Add search bar */}
        <FlatList
          data={Object.values(data)}
          renderItem={renderCollectionItem}
          numColumns={2}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyExtractor={(item: IOpenSeaCollectionWithChain) => item.collection}
          columnWrapperStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            justifyContent: 'space-between',
          }}
        />
      </View>
    );
  }

  return null;
};

export default Collections;
