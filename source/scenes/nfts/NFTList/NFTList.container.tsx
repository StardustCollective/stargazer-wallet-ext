import React, { FC, useLayoutEffect, useState, useEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTList from './NFTList';
import { INFTList } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { IOpenSeaNFT } from 'state/nfts/types';
import { getWalletController } from 'utils/controllersUtils';
import nftsHeader from 'navigation/headers/nfts';
import screens from 'navigation/screens';
import { PLACEHOLDER_IMAGE } from 'constants/index';

const NFTListContainer: FC<INFTList> = ({ navigation, route }) => {
  const { title } = route.params || {};

  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const selectedCollectionLoading = useSelector(
    nftSelectors.getSelectedCollectionLoading
  );
  const [nftsList, setNftsList] = useState(selectedCollection?.nfts);
  const [searchValue, setSearchValue] = useState('');

  const onRefresh = async () => {
    await walletController.nfts.refreshCollection(selectedCollection?.collection);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      ...nftsHeader({ navigation, onRefresh, showLogo: false }),
      title,
    });
  }, [selectedCollection]);

  useEffect(() => {
    if (searchValue && !!selectedCollection?.nfts) {
      const newNftsList = selectedCollection.nfts.filter((nft) =>
        nft.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setNftsList(newNftsList);
    } else {
      setNftsList(selectedCollection?.nfts);
    }
  }, [searchValue, selectedCollection?.nfts]);

  const onSearch = (text: string) => {
    setSearchValue(text);
  };

  const onPressNFT = (nft: IOpenSeaNFT) => {
    walletController.nfts.fetchNFTDetails(
      selectedCollection.chain,
      nft.contract,
      nft.identifier
    );
    navigation.navigate(screens.nfts.nftsDetail, {
      title: nft.name,
      logo: !!nft?.image_url ? nft.image_url : PLACEHOLDER_IMAGE,
      quantity: nft.quantity,
    });
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTList
        selectedCollection={selectedCollection}
        loading={selectedCollectionLoading}
        data={nftsList}
        onPressNFT={onPressNFT}
        searchValue={searchValue}
        onSearch={onSearch}
        onRefresh={onRefresh}
        hasItems={!!selectedCollection?.nfts?.length}
      />
    </Container>
  );
};

export default NFTListContainer;
