import React from 'react';
import { FlatList } from 'react-native';
import styles from './styles';
import LoadingCardNFT from 'components/LoadingCardNFT';

const DATA = [1, 2, 3, 4, 5, 6, 7, 8];

const LoadingList = () => {
  const renderLoadingItem = () => {
    return <LoadingCardNFT />;
  };

  return (
    <FlatList
      data={DATA}
      renderItem={renderLoadingItem}
      numColumns={2}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={(item) => item.toString()}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

export default LoadingList;
