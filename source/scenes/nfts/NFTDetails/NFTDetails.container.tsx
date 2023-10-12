import React, { FC, useLayoutEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTDetails from './NFTDetails';
import { INFTDetails } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { getWalletController } from 'utils/controllersUtils';

const NFTDetailsContainer: FC<INFTDetails> = ({ navigation, route }) => {
  const { title, logo } = route?.params || {};

  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const selectedNFT = useSelector(nftSelectors.getSelectedNft);

  useLayoutEffect(() => {
    navigation.setOptions({ title });

    return () => {
      walletController.nfts.clearSelectedNFT();
    };
  }, []);

  const onPressSendNFT = () => {
    console.log('Send NFT');
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTDetails
        logo={logo}
        selectedCollection={selectedCollection}
        selectedNFT={selectedNFT}
        onPressSendNFT={onPressSendNFT}
      />
    </Container>
  );
};

export default NFTDetailsContainer;
