import React, { FC, useState, useEffect, useLayoutEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import Collections from './Collections';
import { ICollections } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { IOpenSeaCollectionWithChain } from 'state/nfts/types';
import { getWalletController } from 'utils/controllersUtils';
import homeHeader from 'navigation/headers/home';
import screens from 'navigation/screens';

const CollectionsContainer: FC<ICollections> = ({ navigation }) => {
  const walletController = getWalletController();
  const nftsCollections = useSelector(nftSelectors.getNftsCollections);
  const [collections, setCollections] = useState(nftsCollections);
  const [searchValue, setSearchValue] = useState('');

  const onPressCollection = (collection: IOpenSeaCollectionWithChain) => {
    walletController.nfts.setSelectedCollection(collection);
    navigation.navigate(screens.nfts.nftsList, {
      title: collection.name,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader(),
    });
  }, []);

  useEffect(() => {
    if (searchValue) {
      const newCollectionsData = {
        ...nftsCollections,
        data: {},
      };
      for (const key in nftsCollections.data) {
        // Filters collections by name
        if (
          nftsCollections.data[key].name.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          newCollectionsData.data = {
            ...newCollectionsData.data,
            [key]: nftsCollections.data[key],
          };
        }
      }
      setCollections(newCollectionsData);
    } else {
      setCollections(nftsCollections);
    }
  }, [searchValue, nftsCollections]);

  const onSearch = (text: string) => {
    setSearchValue(text);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <Collections
        hasItems={!!Object.keys(nftsCollections?.data || {})?.length}
        collections={collections}
        onPressCollection={onPressCollection}
        searchValue={searchValue}
        onSearch={onSearch}
      />
    </Container>
  );
};

export default CollectionsContainer;
