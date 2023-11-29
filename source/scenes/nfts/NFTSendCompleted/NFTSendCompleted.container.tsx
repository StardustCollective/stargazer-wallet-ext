import React, { FC, useLayoutEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTSendCompleted from './NFTSendCompleted';
import { INFTSendCompleted } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { getWalletController } from 'utils/controllersUtils';
import { OPENSEA_NETWORK_MAP } from 'utils/opensea';
import { open } from 'utils/browser';

const NFTSendCompletedContainer: FC<INFTSendCompleted> = ({ navigation, route }) => {
  const { hash } = route?.params || {};
  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const tempNFTInfo = useSelector(nftSelectors.getTempNFTInfo);

  useLayoutEffect(() => {
    () => {
      walletController.nfts.clearTransferNFT();
    };
  }, []);

  const onViewTransactionPress = () => {
    const BASE_URL = OPENSEA_NETWORK_MAP[selectedCollection.chain].explorer;
    open(`${BASE_URL}/tx/${hash}`);
  };

  const onButtonPress = () => {
    navigation.popToTop();
    walletController.nfts.clearTransferNFT();
    walletController.nfts.fetchAllNfts();
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTSendCompleted
        address={tempNFTInfo.to}
        onButtonPress={onButtonPress}
        onViewTransactionPress={onViewTransactionPress}
      />
    </Container>
  );
};

export default NFTSendCompletedContainer;
