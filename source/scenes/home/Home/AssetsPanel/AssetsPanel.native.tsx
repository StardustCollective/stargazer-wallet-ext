///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////
// Components
///////////////////////

import AssetItem from 'components/AssetItem';
import CardClaim from 'components/CardClaim';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import SlidersIcon from 'assets/images/svg/sliders.svg';

///////////////////////
// Types
///////////////////////

import IAssetState from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Scene
///////////////////////

const AssetsPanel: FC<IAssetState> = ({
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
              showNetwork
              showPrice
            />
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
        <ButtonV3
          title="Manage Tokens"
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
          onPress={handleAddTokens}
          icon={<SlidersIcon width={24} height={24} />}
          iconPosition="left"
          extraStyles={styles.buttonContainer}
          extraTitleStyles={styles.titleContainer}
        />
      </View>
    </View>
  );
};

export default AssetsPanel;
