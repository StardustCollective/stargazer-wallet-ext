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

import IProvidersState from 'state/providers/types';
import { RootState } from 'state/store';
import { IAssetButtonsContainer } from './types';
import IAssetListState from 'state/assets/types';
import IVaultState from 'state/vault/types';

const AssetButtonsContainer: FC<IAssetButtonsContainer> = ({ setShowQrCode, onSendClick, assetId }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  ///////////////////////////
  // Render
  ///////////////////////////

  const onBuyPressed = () => {
    const supportedAssetsArray = supportedAssets?.data;
    const assetsFiltered = assets && supportedAssetsArray ? Object.values(assets)
      .filter((assetValues) => 
          !!activeWallet?.assets?.find(asset => asset?.id === assetValues?.id) && 
          !!supportedAssetsArray?.find(simplexItem => simplexItem?.ticker_symbol === assetValues?.symbol)) : [];
    const assetSupported = !!assetsFiltered?.find(asset => asset?.id === assetId);
    if (assetSupported) {
      linkTo(`/buyAsset?selected=${assetId}`);
    } else {
      linkTo('/buyList');
    }
  };

  const onSendPressed = () => {
    onSendClick();
  };

  const onReceivePressed = () => {
    setShowQrCode(true);
  };

  return <AssetButtons onBuyPressed={onBuyPressed} onSendPressed={onSendPressed} onReceivePressed={onReceivePressed} />;
};

export default AssetButtonsContainer;
