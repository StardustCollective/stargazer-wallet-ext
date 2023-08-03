import React, { FC } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import ChevronRight from 'assets/images/svg/arrow-rounded-right.svg';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { AssetType } from 'state/vault/types';
import { ellipsis, truncateString } from 'scenes/home/helpers';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import IWalletsSettings from './types';
import styles from './styles';

const WalletsComponent: FC<IWalletsSettings> = ({
  wallets,
  assets,
  privKeyAccounts,
  handleManageWallet,
}) => {
  const renderStargazerIcon = () => {
    return <StargazerIcon width={40} height={40} style={{ backgroundColor: 'white' }} />;
  };

  const renderEthereumIcon = () => {
    const logoURL = assets[AssetType.Ethereum].logo;
    return (
      <View
        style={StyleSheet.flatten([
          styles.stargazerIconWrapper,
          styles.assetIconWrapperETH,
        ])}
      >
        <Image source={{ uri: logoURL }} style={styles.assetIcon} />
      </View>
    );
  };

  const renderConstellationIcon = () => {
    const logoURL = assets[AssetType.Constellation].logo;

    return (
      <View
        style={StyleSheet.flatten([
          styles.stargazerIconWrapper,
          styles.assetIconWrapperDAG,
        ])}
      >
        <Image source={{ uri: logoURL }} style={styles.assetIcon} />
      </View>
    );
  };

  const multiChainWallets = wallets.filter(
    (w) => w.type === KeyringWalletType.MultiChainWallet
  );

  return (
    <ScrollView
      style={styles.wallets}
      contentContainerStyle={styles.walletsContentContainer}
    >
      {!!multiChainWallets.length && (
        <>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            Multi Chain Wallets
          </TextV3.Caption>
          <View style={styles.groupWalletWrapper}>
            {multiChainWallets.map((wallet, i) => {
              const walletStyles = StyleSheet.flatten([
                styles.walletWrapper,
                i === 0 ? styles.firstChild : {},
                i === multiChainWallets.length - 1 ? styles.lastChild : {},
              ]);

              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => handleManageWallet(wallet.id)}
                  activeOpacity={0.6}
                >
                  <View style={walletStyles}>
                    {renderStargazerIcon()}
                    <View testID={wallet.label} style={styles.walletInfoContainer}>
                      <View style={styles.walletLabelContainer}>
                        <TextV3.Caption
                          dynamic
                          color={COLORS_ENUMS.BLACK}
                          extraStyles={styles.text}
                        >
                          {truncateString(wallet.label)}
                        </TextV3.Caption>
                        <TextV3.Caption dynamic extraStyles={styles.textSmall}>
                          Multi Chain Wallet
                        </TextV3.Caption>
                      </View>
                      <View style={styles.rightArrow}>
                        <ChevronRight height={14} width={12} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      {!!privKeyAccounts.length && (
        <>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            Private Key Wallets
          </TextV3.Caption>
          <View style={styles.groupWalletWrapper}>
            {privKeyAccounts.map((wallet, i) => {
              const walletStyles = StyleSheet.flatten([
                styles.walletWrapper,
                i === 0 ? styles.firstChild : {},
                i === privKeyAccounts.length - 1 ? styles.lastChild : {},
              ]);

              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => handleManageWallet(wallet.id)}
                  activeOpacity={0.6}
                >
                  <View style={walletStyles} key={wallet.id}>
                    {wallet.supportedAssets.includes(KeyringAssetType.ETH)
                      ? renderEthereumIcon()
                      : renderConstellationIcon() || renderStargazerIcon()}
                    <View testID={wallet.label} style={styles.walletInfoContainer}>
                      <View style={styles.walletLabelContainer}>
                        <TextV3.Caption dynamic extraStyles={styles.text}>
                          {truncateString(wallet.label)}
                        </TextV3.Caption>
                        <TextV3.Caption dynamic extraStyles={styles.textSmall}>
                          {ellipsis(wallet.accounts[0].address)}
                        </TextV3.Caption>
                      </View>
                      <View style={styles.rightArrow}>
                        <ChevronRight height={14} width={12} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default WalletsComponent;
