import React, { FC } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

import { Button } from 'react-native-elements';
import TextV3 from 'components/TextV3';
import Icon from 'components/Icon';

import { KeyringAssetType, KeyringWalletAccountState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { AssetType } from 'state/vault/types';

import { ellipsis } from 'scenes/home/helpers';

import StargazerIcon from 'assets/images/logo-s.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';

import IWalletsSettings from './types';

import styles from './styles';

const WalletsComponent: FC<IWalletsSettings> = ({
  wallets,
  activeWallet,
  assets,
  privKeyAccounts,
  handleSwitchWallet,
  handleManageWallet,
}) => {
  const renderCheckIcon = (walletId, activeWalletId) => {
    if (walletId !== activeWalletId) {
      return null;
    }

    return (
      <Icon
        name="check-circle"
        // spaced={false}
        iconContainerStyles={styles.iconCheckWrapper}
        iconStyles={styles.iconCheck}
        style="solid"
      />
    );
  };

  const renderInfoIcon = (walletId) => {
    return (
      <Button
        icon={{
          name: 'info',
          ...styles.infoIcon,
        }}
        iconContainerStyle={styles.infoIconWrapper}
        buttonStyle={{ backgroundColor: 'transparent', padding: 0, alignSelf: 'flex-end' }}
        onPress={(ev) => handleManageWallet(ev, walletId)}
      />
    );
  };

  const onHandleSwitchWallet = (walletId: string, accounts: KeyringWalletAccountState[]) => {
    return () => {
      return handleSwitchWallet(walletId, accounts);
    };
  };

  const renderStargazerIcon = () => {
    return (
      <View style={styles.stargazerIconWrapper}>
        <StargazerIcon width={24} height={24} style={{ backgroundColor: COLORS_ENUMS.primary }} />
      </View>
    );
  };

  const renderEthereumIcon = () => {
    const logoURL = assets[AssetType.Ethereum].logo;
    return (
      <View style={StyleSheet.flatten([styles.stargazerIconWrapper, styles.assetIconWrapperETH])}>
        <Image source={{ uri: logoURL }} style={styles.assetIcon} />
      </View>
    );
  };

  const renderConstellationIcon = () => {
    const logoURL = assets[AssetType.Constellation].logo;

    return (
      <View style={StyleSheet.flatten([styles.stargazerIconWrapper, styles.assetIconWrapperDAG])}>
        <Image source={{ uri: logoURL }} style={styles.assetIcon} />
      </View>
    );
  };

  const multiChainWallets = wallets.filter((w) => w.type === KeyringWalletType.MultiChainWallet);

  return (
    <ScrollView style={styles.wallets} contentContainerStyle={styles.walletsContentContainer}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        Multi chain wallets
      </TextV3.Caption>
      <View style={styles.groupWalletWrapper}>
        {multiChainWallets.map((wallet, i) => {
          const walletStyles = StyleSheet.flatten([
            styles.walletWrapper,
            i === 0 ? styles.firstChild : {},
            i === multiChainWallets.length - 1 ? styles.lastChild : {},
          ]);

          return (
            <TouchableOpacity key={wallet.id} onPress={onHandleSwitchWallet(wallet.id, wallet.accounts)}>
              <View style={walletStyles}>
                {renderCheckIcon(wallet.id, activeWallet?.id)}
                {renderStargazerIcon()}
                <View testID={wallet.label} style={styles.walletInfoContainer}>
                  <View style={styles.walletLabelContainer}>
                    <TextV3.Caption dynamic color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
                      {wallet.label}
                    </TextV3.Caption>
                    <TextV3.Caption dynamic extraStyles={styles.textSmall}>Multi Chain Wallet</TextV3.Caption>
                  </View>
                  <View style={styles.walletInfoIcon}>{renderInfoIcon(wallet.id)}</View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!privKeyAccounts.length && (
        <>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            Private key wallets
          </TextV3.Caption>
          <View style={styles.groupWalletWrapper}>
            {privKeyAccounts.map((wallet, i) => {
              const walletStyles = StyleSheet.flatten([
                styles.walletWrapper,
                i === 0 ? styles.firstChild : {},
                i === privKeyAccounts.length - 1 ? styles.lastChild : {},
              ]);

              return (
                <TouchableOpacity key={wallet.id} onPress={onHandleSwitchWallet(wallet.id, wallet.accounts)}>
                  <View style={walletStyles} key={wallet.id}>
                    {renderCheckIcon(wallet.id, activeWallet?.id)}
                    {wallet.supportedAssets.includes(KeyringAssetType.ETH)
                      ? renderEthereumIcon()
                      : renderConstellationIcon() || renderStargazerIcon()}
                    <View testID={wallet.label} style={styles.walletInfoContainer}>
                      <View style={styles.walletLabelContainer}>
                        <TextV3.Caption dynamic color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
                          {wallet.label}
                        </TextV3.Caption>
                        <TextV3.Caption dynamic extraStyles={styles.textSmall}>
                          {ellipsis(wallet.accounts[0].address)}
                        </TextV3.Caption>
                      </View>
                      <View style={styles.walletInfoIcon}>{renderInfoIcon(wallet.id)}</View>
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
