///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import AssetButtons from './AssetButtons';

///////////////////////////
// Types
///////////////////////////

import { IAssetButtonsContainer } from './types';

const AssetButtonsContainer: FC<IAssetButtonsContainer> = ({ setShowQrCode, onSendClick, assetId }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();

  ///////////////////////////
  // Render
  ///////////////////////////

  const onBuyPressed = () => {
    linkTo(`/buyAsset?selected=${assetId}`);
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
