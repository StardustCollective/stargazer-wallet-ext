import React, { FC } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Button } from 'react-native-elements';
import TextV3 from 'components/TextV3';
import Icon from 'components/Icon';

import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { AssetType, IAccountDerived } from 'state/vault/types';

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
        spaced={false}
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
        buttonStyle={{ backgroundColor: 'transparent' }}
        onPress={(ev) => handleManageWallet(ev, walletId)}
      />
    );
  };

  const onHandleSwitchWallet = (walletId, accounts) => {
    return () => {
      return handleSwitchWallet(walletId, accounts as IAccountDerived[]);
    };
  };

  const renderStargazerIcon = () => {
    return (
      <View style={styles.stargazerIconWrapper}>
        <StargazerIcon width={25} height={25} style={{ backgroundColor: COLORS_ENUMS.primary }} />
      </View>
    );
  };

  const renderEthereumIcon = () => {
    const Logo = assets[AssetType.Ethereum].logo;

    return (
      <View style={styles.stargazerIconWrapper}>
        <Logo width={25} height={25} style={{ backgroundColor: 'transparent' }} />
      </View>
    );
  };

  const renderConstellationIcon = () => {
    const Logo = assets[AssetType.Constellation].logo;

    return (
      <View style={styles.stargazerIconWrapper}>
        <Logo width={25} height={25} style={{ backgroundColor: 'white' }} />
      </View>
    );
  };

  const multiChainWallets = wallets.filter((w) => w.type === KeyringWalletType.MultiChainWallet);
  return (
    <View style={styles.wallets}>
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
                {renderCheckIcon(wallet.id, activeWallet.id)}
                {renderStargazerIcon()}
                <View testID={wallet.label}>
                  <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
                    {wallet.label}
                  </TextV3.Caption>
                  <TextV3.Caption extraStyles={styles.textSmall}>Multi Chain Wallet</TextV3.Caption>
                </View>
                {renderInfoIcon(wallet.id)}
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
                <TouchableOpacity pointerkey={wallet.id} onPress={onHandleSwitchWallet(wallet.id, wallet.accounts)}>
                  <View style={walletStyles} key={wallet.id}>
                    {renderCheckIcon(wallet.id, activeWallet.id)}
                    {assets[wallet.supportedAssets.includes(KeyringAssetType.ETH)]
                      ? renderEthereumIcon()
                      : renderConstellationIcon() || renderStargazerIcon()}
                    <View>
                      <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
                        {wallet.label}
                      </TextV3.Caption>
                      <TextV3.Caption extraStyles={styles.textSmall}>{wallet.accounts[0].address}</TextV3.Caption>
                    </View>
                    {renderInfoIcon(wallet.id)}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default WalletsComponent;
