import React, { FC, useEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import NFTSendConfirm from './NFTSendConfirm';
import { INFTSendConfirm } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { getWalletController } from 'utils/controllersUtils';
import { OPENSEA_NETWORK_MAP } from 'utils/opensea';
import screens from 'navigation/screens';
import { ellipsis } from 'scenes/home/helpers';
import { AssetType } from 'state/vault/types';

const NFTSendConfirmContainer: FC<INFTSendConfirm> = ({ navigation }) => {
  const walletController = getWalletController();
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const selectedNFT = useSelector(nftSelectors.getSelectedNftData);
  const tempNFTInfo = useSelector(nftSelectors.getTempNFTInfo);
  const transferNFT = useSelector(nftSelectors.getTransferNFT);

  useEffect(() => {
    if (transferNFT.data) {
      const txHash = transferNFT.data;
      walletController.nfts.clearTransferNFT();
      navigation.navigate(screens.nfts.nftsSendCompleted, {
        hash: txHash,
      });
    }
  }, [transferNFT.data]);

  const onButtonPress = () => {
    const network = OPENSEA_NETWORK_MAP[selectedCollection.chain];
    walletController.nfts.transferNFT(tempNFTInfo, network);
  };

  const props = {
    quantity: tempNFTInfo.quantity,
    sendFrom: `${tempNFTInfo.from.label} (${ellipsis(tempNFTInfo.from.address)})`,
    sendTo: `${ellipsis(tempNFTInfo.to)}`,
    transactionFee: `${tempNFTInfo.gas.fee} ${tempNFTInfo.gas.symbol} (${tempNFTInfo.gas.price})`,
    maxTotal: `${tempNFTInfo.gas.fee} ${tempNFTInfo.gas.symbol}`,
    nftLogo: selectedNFT.image_url,
    nftName: selectedNFT.name,
    loading: transferNFT.loading,
    isERC721: selectedNFT.token_standard === AssetType.ERC721,
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTSendConfirm onButtonPress={onButtonPress} {...props} />
    </Container>
  );
};

export default NFTSendConfirmContainer;
