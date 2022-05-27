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
import IVaultState from 'state/vault/types';

const BuyListContainer: FC = () => {
  
  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assetsFiltered = supportedAssets.data ? Object.keys(supportedAssets.data)
    .filter((assetId) => !!activeWallet?.assets?.find((asset) => asset?.id === assetId))
    .reduce((obj: any, key: any) => {
      obj[key] = supportedAssets.data[`${key}`];
      return obj;
    }, {}) : {};

  const handleSelectAsset = async (assetId: string) => {
    linkTo(`/buyAsset?selected=${assetId}`);
  };

  const filteredAssets = {
    ...supportedAssets,
    data: assetsFiltered
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <BuyList supportedAssets={filteredAssets} handleSelectAsset={handleSelectAsset} />
    </Container>
  );
};

export default BuyListContainer;
