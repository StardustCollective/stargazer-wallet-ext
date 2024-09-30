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
import IProvidersState, { MapProviderNetwork } from 'state/providers/types';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { getDagAddress, getEthAddress } from 'utils/wallet';
import { usePlatformAlert } from 'utils/alertUtil';

const NO_QUOTES = 'There are no quotes available for this token, please try again later!';

const BuyListContainer: FC = () => {
  const linkTo = useLinkTo();
  const showAlert = usePlatformAlert();
  const { supportedAssets, defaultTokens }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const loading = supportedAssets.loading || defaultTokens.loading;
  const supportedAssetsArray = supportedAssets?.data ?? [];
  const defaultAssets = !!defaultTokens?.data ? Object.values(defaultTokens.data) : [];
  const defaultAssetsIds = !!defaultAssets?.length
    ? defaultAssets.map((asset) => asset.id)
    : [];

  const buildAssetsList = () => {
    let activeAssets: IAssetInfoState[] = [];
    if (!activeWallet?.assets) {
      activeAssets = [];
    }

    activeAssets = activeWallet.assets
      .map((asset) => assets[asset.id])
      .filter((asset) => {
        const notDefault = !defaultAssetsIds.includes(asset?.id);
        const supportedAsset = supportedAssetsArray?.find(
          (item) =>
            item?.symbol === asset?.symbol &&
            MapProviderNetwork[item?.network] === asset?.network
        );

        return notDefault && !!supportedAsset;
      });

    return defaultAssets
      .concat(activeAssets)
      .filter((asset) =>
        asset.type === AssetType.Constellation
          ? !!getDagAddress(activeWallet)
          : !!getEthAddress(activeWallet)
      );
  };

  const allAssets = buildAssetsList();

  const handleSelectAsset = async (asset: IAssetInfoState) => {
    const supportedAsset = !!supportedAssetsArray?.find(
      (item) => item?.symbol === asset?.symbol
    );

    if (supportedAsset) {
      linkTo(`/buyAsset?selected=${asset.id}`);
    } else {
      showAlert(NO_QUOTES, 'danger');
    }
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <BuyList
        loading={loading}
        assets={allAssets}
        handleSelectAsset={handleSelectAsset}
      />
    </Container>
  );
};

export default BuyListContainer;
