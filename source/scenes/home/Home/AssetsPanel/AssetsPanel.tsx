import React, { FC } from 'react';
import AssetItem from 'components/AssetItem';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import SlidersIcon from 'assets/images/svg/sliders.svg';
import CardClaim from 'components/CardClaim';
import { ToastPosition, ToastType, useToast } from 'context/ToastContext';
import IAssetPanel from './types';
import styles from './AssetsPanel.scss';

const AssetsPanel: FC<IAssetPanel> = ({
  activeNetworkAssets,
  showClaimCard,
  assets,
  activeWallet,
  handleSelectAsset,
  handleAddTokens,
  handleHideCard,
}) => {
  const { showToast } = useToast();

  const handleShowToast = () => {
    showToast({
      type: ToastType.info,
      position: ToastPosition.bottom,
      title: 'El Paca rewards card hidden',
      message1: 'To unhide your rewards card go to',
      message2: 'Settings > Personalize > El Paca Rewards',
      message2Style: styles.toastMessage2,
    });
  };

  const onPressHideCard = () => {
    handleShowToast();
    handleHideCard();
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
        {showClaimCard && <CardClaim onPressHideCard={onPressHideCard} />}
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
