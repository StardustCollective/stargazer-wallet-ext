import React, { FC, useLayoutEffect, useState, useEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTList from './NFTList';
import { INFTList } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { IOpenSeaNFT } from 'state/nfts/types';
import { getWalletController } from 'utils/controllersUtils';
import screens from 'navigation/screens';

const NFTListContainer: FC<INFTList> = ({ navigation }) => {
  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const [nftsList, setNftsList] = useState(selectedCollection.nfts);
  const [searchValue, setSearchValue] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: selectedCollection.name });

    return () => {
      walletController.nfts.clearSelectedCollection();
    };
  }, []);

  useEffect(() => {
    if (searchValue) {
      const newNftsList = selectedCollection.nfts.filter((nft) =>
        nft.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setNftsList(newNftsList);
    } else {
      setNftsList(selectedCollection.nfts);
    }
  }, [searchValue, selectedCollection.nfts]);

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
      logo: nft.image_url,
    });
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTList
        selectedCollection={selectedCollection}
        data={nftsList}
        onPressNFT={onPressNFT}
        searchValue={searchValue}
        onSearch={onSearch}
        hasItems={!!selectedCollection?.nfts?.length}
      />
    </Container>
  );
};

export default NFTListContainer;
