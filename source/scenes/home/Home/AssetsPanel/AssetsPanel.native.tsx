///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View, Linking } from 'react-native';

///////////////////////
// Components
///////////////////////

import AssetItem from 'components/AssetItem';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';

///////////////////////
// Types
///////////////////////
import { INFTInfoState } from 'state/nfts/types';
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
  handleAddTokens,
  assets,
  activeNFTAssets,
  nfts,
  activeWallet,
}) => {
  const handleSelectNFT = (nft: INFTInfoState) => {
    Linking.openURL(nft.link);
  };

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
    <View style={styles.container}>
      <View style={styles.content}>
        {Object.keys(activeWallet.assets).length && (
          <>{renderAssetList()}</>
        )}
        <ButtonV3 
          title="Manage Tokens" 
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE} 
          color={COLORS_ENUMS.DARK_GRAY}
          onPress={handleAddTokens} 
        />
      </View>
    </View>
  );
};

export default AssetsPanel;
