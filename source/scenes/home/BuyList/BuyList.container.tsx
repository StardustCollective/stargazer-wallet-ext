///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import BuyList from './BuyList';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import IProvidersState from 'state/providers/types';

const BuyListContainer: FC = () => {
  
  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);

  const handleSelectAsset = async (assetId: string) => {
    linkTo(`/buyAsset?selected=${assetId}`);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <BuyList supportedAssets={supportedAssets} handleSelectAsset={handleSelectAsset} />
    </Container>
  );
};

export default BuyListContainer;
