import React, { FC } from 'react';
import AssetItem from 'components/AssetItem';
import { INFTInfoState } from 'state/nfts/types';
import IAssetPanel from './types';
import styles from './AssetsPanel.scss';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import SlidersIcon from 'assets/images/svg/sliders.svg'

const AssetsPanel: FC<IAssetPanel> = ({
  activeNetworkAssets,
  handleSelectAsset,
  handleAddTokens,
  assets,
  activeNFTAssets,
  nfts,
  activeWallet,
}) => {
  const handleSelectNFT = (nft: INFTInfoState) => {
    window.open(nft.link, '_blank');
  };

  const renderAssetList = () => {
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
              showNetwork
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
    <section className={styles.activity}>
      <div className={styles.content}>
        {Object.keys(activeWallet.assets).length && (
          <>{renderAssetList()}</>
        )}
        <div className={styles.buttonContainer}>
          <ButtonV3 
            label="Manage Tokens" 
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
            leftIcon={<img src={`/${SlidersIcon}`} className={styles.icon} alt="Slider icon" />}
            onClick={handleAddTokens} 
            extraStyle={styles.button}
          />
        </div>
      </div>
    </section>
  );
};

export default AssetsPanel;
