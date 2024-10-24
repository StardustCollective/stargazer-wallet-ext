import React, { FC } from 'react';
import AssetItem from 'components/AssetItem';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import SlidersIcon from 'assets/images/svg/sliders.svg';
import IAssetPanel from './types';
import styles from './AssetsPanel.scss';
import CardClaim from 'components/CardClaim';

const AssetsPanel: FC<IAssetPanel> = ({
  activeNetworkAssets,
  showClaimCard,
  claimLoading,
  handleSelectAsset,
  handleAddTokens,
  handleClaim,
  handleClose,
  handleLearnMore,
  assets,
  activeWallet,
  elpaca,
}) => {
  const { streak, claim } = elpaca;
  const {
    claimAmount,
    currentStreak,
    totalEarned,
    currentClaimWindow,
    showError,
    claimEnabled,
  } = streak?.data ?? {};
  const { loading } = claim ?? {};

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
        {showClaimCard && (
          <CardClaim
            loading={loading || claimLoading}
            currentStreak={currentStreak}
            totalEarned={totalEarned}
            amount={claimAmount}
            currentClaimWindow={currentClaimWindow}
            claimEnabled={claimEnabled}
            showError={showError}
            handleClaim={handleClaim}
            handleLearnMore={handleLearnMore}
            handleClose={handleClose}
          />
        )}
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
