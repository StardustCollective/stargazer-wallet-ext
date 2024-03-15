///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'assets/images/svg/check-transparent.svg';
import StargazerIcon from 'assets/images/logo-s.svg';

///////////////////////////
// Utils
///////////////////////////

import { truncateString, ellipsis } from 'scenes/home/helpers';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';
import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { IWalletsModal } from './types';

///////////////////////////
// Constants
///////////////////////////

///////////////////////////
// Scene
///////////////////////////

const WalletsModal: FC<IWalletsModal> = ({
  multiChainWallets,
  privateKeyWallets,
  activeWallet,
  handleSwitchWallet,
}) => {
  const renderStargazerIcon = () => {
    return (
      <View style={styles.stargazerIconWrapper}>
        <StargazerIcon
          width={24}
          height={24}
          style={{ backgroundColor: COLORS_ENUMS.primary }}
        />
      </View>
    );
  };

  const renderEthereumIcon = () => {
    return (
      <View style={styles.assetIconWrapper}>
        <Image source={{ uri: ETHEREUM_LOGO }} style={styles.assetIcon} />
      </View>
    );
  };

  const renderConstellationIcon = () => {
    return (
      <View style={styles.assetIconWrapper}>
        <Image source={{ uri: CONSTELLATION_LOGO }} style={styles.assetIcon} />
      </View>
    );
  };

  const renderCheckIcon = (walletId: string, activeWalletId: string) => {
    if (walletId !== activeWalletId) {
      return null;
    }

    return (
      <View style={styles.checkContainer}>
        <CheckIcon height={12} width={18} />
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {!!multiChainWallets.length && (
        <>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
            Multi-Chain Wallets
          </TextV3.Caption>
          {multiChainWallets.map((wallet, i) => {
            const walletStyles = StyleSheet.flatten([
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === multiChainWallets.length - 1 ? styles.lastChild : {},
            ]);

            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSwitchWallet(wallet.id, wallet.accounts)}
              >
                <View style={walletStyles}>
                  {renderStargazerIcon()}
                  <View testID={wallet.label} style={styles.walletInfoContainer}>
                    <View style={styles.walletLabelContainer}>
                      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                        {truncateString(wallet.label)}
                      </TextV3.CaptionStrong>
                      <TextV3.Caption dynamic color={COLORS_ENUMS.GRAY_100}>
                        Multi-Chain Wallet
                      </TextV3.Caption>
                    </View>
                    {renderCheckIcon(wallet.id, activeWallet?.id)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )}
      {!!privateKeyWallets.length && (
        <View style={styles.privateKeysContainer}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
            Private Key Wallets
          </TextV3.Caption>
          {privateKeyWallets.map((wallet, i) => {
            const walletStyles = StyleSheet.flatten([
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === privateKeyWallets.length - 1 ? styles.lastChild : {},
            ]);

            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleSwitchWallet(wallet.id, wallet.accounts)}
              >
                <View style={walletStyles}>
                  {wallet.supportedAssets.includes(KeyringAssetType.ETH)
                    ? renderEthereumIcon()
                    : renderConstellationIcon()}
                  <View testID={wallet.label} style={styles.walletInfoContainer}>
                    <View style={styles.walletLabelContainer}>
                      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                        {truncateString(wallet.label)}
                      </TextV3.CaptionStrong>
                      <TextV3.Caption dynamic color={COLORS_ENUMS.GRAY_100}>
                        {ellipsis(wallet.accounts[0].address)}
                      </TextV3.Caption>
                    </View>
                    {renderCheckIcon(wallet.id, activeWallet?.id)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default WalletsModal;
