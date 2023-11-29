import React, { FC, useLayoutEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTDetails from './NFTDetails';
import { INFTDetails } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { getWalletController } from 'utils/controllersUtils';
import nftsHeader from 'navigation/headers/nfts';
import screens from 'navigation/screens';
import { open } from 'utils/browser';
import { OPENSEA_ASSET_URL, OPENSEA_TESTNETS_ASSET_URL } from './constants';
import { isOpenSeaTestnet } from 'utils/opensea';
import { PLACEHOLDER_IMAGE } from 'constants/index';

const NFTDetailsContainer: FC<INFTDetails> = ({ navigation, route }) => {
  const { title, logo, quantity } = route?.params || {};

  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const selectedNFT = useSelector(nftSelectors.getSelectedNft);

  const logoURL = !!logo
    ? logo
    : !!selectedNFT?.data?.image_url
    ? selectedNFT?.data?.image_url
    : PLACEHOLDER_IMAGE;

  useLayoutEffect(() => {
    navigation.setOptions({
      ...nftsHeader({ showRefresh: false, showLogo: false, navigation }),
      title,
    });

    return () => {
      walletController.nfts.clearSelectedNFT();
    };
  }, []);

  const onPressSendNFT = () => {
    navigation.navigate(screens.nfts.nftsSend, {
      amount: quantity,
      logo: logoURL,
    });
  };

  const onPressViewOpenSea = () => {
    const BASE_URL = isOpenSeaTestnet(selectedCollection.chain)
      ? OPENSEA_TESTNETS_ASSET_URL
      : OPENSEA_ASSET_URL;
    open(
      `${BASE_URL}/${selectedCollection.chain}/${selectedNFT.data.contract}/${selectedNFT.data.identifier}`
    );
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTDetails
        logo={logoURL}
        quantity={quantity}
        selectedNFT={selectedNFT}
        onPressSendNFT={onPressSendNFT}
        onPressViewOpenSea={onPressViewOpenSea}
      />
    </Container>
  );
};

export default NFTDetailsContainer;
