import React, { FC } from 'react';
import AssetItem from 'components/AssetItem';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import SlidersIcon from 'assets/images/svg/sliders.svg';
import IAssetPanel from './types';
import styles from './AssetsPanel.scss';

const AssetsPanel: FC<IAssetPanel> = ({
  activeNetworkAssets,
  handleSelectAsset,
  handleAddTokens,
  assets,
  activeWallet,
}) => {
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
              showPrice
            />
          );
        })}
      </>
    );
  };

  return (
    <section className={styles.activity}>
      <div className={styles.content}>
        {Object.keys(activeWallet.assets).length && <>{renderAssetList()}</>}
        <div className={styles.buttonContainer}>
          <ButtonV3
            label="Manage Tokens"
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
            leftIcon={
              <img src={`/${SlidersIcon}`} className={styles.icon} alt="Slider icon" />
            }
            onClick={handleAddTokens}
            extraStyle={styles.button}
            extraTitleStyles={styles.buttonTitle}
          />
        </div>
      </div>
    </section>
  );
};

export default AssetsPanel;
