///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
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
import { getAccountController } from 'utils/controllersUtils';

const BuyListContainer: FC = () => {
  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const accountController = getAccountController();
  const supportedAssetsArray = supportedAssets?.data;
  const assetsFiltered =
    assets && supportedAssetsArray && Array.isArray(supportedAssetsArray)
      ? Object.values(assets).filter(
          (assetValues) =>
            !!activeWallet?.assets?.find(
              (asset) =>
                asset?.id === assetValues?.id &&
                ['both', 'mainnet'].includes(assetValues?.network)
            ) &&
            !!supportedAssetsArray?.find(
              (simplexItem) => simplexItem?.ticker_symbol === assetValues?.symbol
            )
        )
      : [];

  useEffect(() => {
    const getAssets = async () => {
      await accountController.assetsController.fetchSupportedAssets();
    };
    if (!supportedAssets.data) {
      getAssets();
    }
  }, []);

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
