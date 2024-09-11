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
import IAssetListState from 'state/assets/types';

const BuyListContainer: FC = () => {
  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const supportedAssetsArray = supportedAssets?.data;
  const assetsFiltered =
    assets && supportedAssetsArray && Array.isArray(supportedAssetsArray)
      ? Object.values(assets).filter(
          (assetValues) =>
            !!activeWallet?.assets?.find(
              (asset) =>
                asset?.id === assetValues?.id &&
                ['both', 'mainnet', 'bsc', 'avalanche-mainnet', 'matic'].includes(
                  assetValues?.network
                )
            ) &&
            !!supportedAssetsArray?.find(
              (simplexItem) => simplexItem?.symbol === assetValues?.symbol
            )
        )
      : [];

  const handleSelectAsset = async (assetId: string) => {
    linkTo(`/buyAsset?selected=${assetId}`);
  };

  const filteredAssets = {
    ...supportedAssets,
    data: assetsFiltered,
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
