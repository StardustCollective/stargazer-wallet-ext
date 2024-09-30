///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import AssetButtons from './AssetButtons';

///////////////////////////
// Types
///////////////////////////

import IProvidersState, { MapProviderNetwork } from 'state/providers/types';
import { RootState } from 'state/store';
import { IAssetButtonsContainer } from './types';
import IAssetListState from 'state/assets/types';

const AssetButtonsContainer: FC<IAssetButtonsContainer> = ({
  setShowQrCode,
  onSendClick,
  assetId,
}) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const supportedAssetsArray = supportedAssets?.data ?? [];
  const assetInfo = assets[assetId];

  const assetSupported = !!supportedAssetsArray.find(
    (asset) =>
      asset?.symbol === assetInfo?.symbol &&
      (assetInfo.network === 'both' ||
        MapProviderNetwork[asset?.network] === assetInfo?.network)
  );

  ///////////////////////////
  // Render
  ///////////////////////////

  const onBuyPressed = () => {
    if (assetSupported) {
      linkTo(`/buyAsset?selected=${assetId}`);
    }
  };

  const onSendPressed = () => {
    onSendClick();
  };

  const onReceivePressed = () => {
    setShowQrCode(true);
  };

  return (
    <AssetButtons
      assetBuyable={assetSupported}
      onBuyPressed={onBuyPressed}
      onSendPressed={onSendPressed}
      onReceivePressed={onReceivePressed}
    />
  );
};

export default AssetButtonsContainer;
