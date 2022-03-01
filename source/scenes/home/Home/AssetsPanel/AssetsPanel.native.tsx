///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////
// Components
///////////////////////

import AssetItem from 'components/AssetItem';
import TextV3 from 'components/TextV3';

///////////////////////
// Types
///////////////////////

import IAssetState from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// Scene
///////////////////////

const AssetsPanel: FC<IAssetState> = ({
  activeNetworkAssets,
  handleSelectAsset,
  assets,
  activeNFTAssets,
  nfts,
  handleSelectNFT,
  activeWallet,
}) => {
  const renderAssetList = () => {
    ///////////////////////
    // Render
    ///////////////////////

    return (
      <>
        {activeNetworkAssets.map((asset: any) => {
          return (
            <AssetItem
              id={asset.id}
              key={asset.id}
              asset={asset}
              assetInfo={assets[asset.id]}
              itemClicked={() => handleSelectAsset(asset)}
            />
          );
        })}
        {activeNFTAssets.map((nft: any) => {
          return (
            <AssetItem
              id={nft.id}
              key={nft.id}
              asset={nft}
              assetInfo={nfts[nft.id]}
              itemClicked={() => handleSelectNFT(nfts[nft.id])}
            />
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.activity}>
      <View style={styles.content}>
        {Object.keys(activeWallet.assets).length ? (
          <>{renderAssetList()}</>
        ) : (
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
            You have no assets. Please add new Asset by Click + icon.
          </TextV3.Caption>
        )}
      </View>
    </View>
  );
};

export default AssetsPanel;
