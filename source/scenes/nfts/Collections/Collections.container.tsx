import React, { FC } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import Collections from './Collections';
import { ICollections } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { IOpenSeaNFT } from 'state/nfts/types';
import { getWalletController } from 'utils/controllersUtils';

const CollectionsContainer: FC<ICollections> = ({}) => {
  const walletController = getWalletController();
  const nftsCollections = useSelector(nftSelectors.getNftsCollections);

  const onPressCollection = (nft: IOpenSeaNFT) => {
    walletController.nfts.setSelectedNFT(nft);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <Collections collections={nftsCollections} onPressCollection={onPressCollection} />
    </Container>
  );
};

export default CollectionsContainer;
