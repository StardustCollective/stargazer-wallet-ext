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

const AssetButtonsContainer: FC<IAssetButtonsContainer> = ({ setShowQrCode, onSendClick, assetId }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const { supportedAssets }: IProvidersState = useSelector((state: RootState) => state.providers);

  ///////////////////////////
  // Render
  ///////////////////////////

  const onBuyPressed = () => {
    const assetSupported = supportedAssets?.data && supportedAssets?.data[assetId];
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
