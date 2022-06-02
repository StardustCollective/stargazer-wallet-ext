import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import Icon from 'components/Icon';
import TextV3 from 'components/TextV3';

import StargazerIcon from 'assets/images/logo-s.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import ConstellationIcon from 'assets/images/svg/constellation.svg';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

import IImportWalletSettings from './types';

const _renderIcon = (
  Component: React.Component,
  width: number,
  height: number,
  containerStyles: object,
  iconStyles: object = {}
) => {
  return (
    <View style={containerStyles}>
      <Component width={width} height={height} iconStyles={iconStyles} />
    </View>
  );
};

const ImportWallet: FC<IImportWalletSettings> = ({ handleImport, onImportPhraseView }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity testID="importWallet-multiChainWallet" onPress={onImportPhraseView}>
        <View style={StyleSheet.flatten([styles.menu, styles.firstChild])}>
          <View style={styles.menuIconSection}>
            {_renderIcon(StargazerIcon, 24, 24, styles.iconContainer)}
            <TextV3.Label color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
              Multi Chain Wallet
            </TextV3.Label>
          </View>
          <Icon
            name="chevron-right"
            spaced={false}
            iconStyles={styles.arrowRightIcon}
            iconContainerStyles={styles.arrowRightWrapper}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity testID="importWallet-ethereum" onPress={handleImport(KeyringNetwork.Ethereum)}>
        <View style={StyleSheet.flatten([styles.menu, styles.secondChild])}>
          <View style={styles.menuIconSection}>
            {_renderIcon(EthereumIcon, 24, 24, { ...styles.iconContainer, ...styles.iconETHWrapper }, styles.iconETH)}
            <TextV3.Label color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
              Ethereum
            </TextV3.Label>
          </View>
          <Icon
            name="chevron-right"
            spaced={false}
            iconStyles={styles.arrowRightIcon}
            iconContainerStyles={styles.arrowRightWrapper}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity testID="importWallet-constellation" onPress={handleImport(KeyringNetwork.Constellation)}>
        <View style={StyleSheet.flatten([styles.menu, styles.lastChild])}>
          <View style={styles.menuIconSection}>
            {_renderIcon(ConstellationIcon, 24, 24, { ...styles.iconContainer, ...styles.iconDAGWrapper })}
            <TextV3.Label color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
              Constellation
            </TextV3.Label>
          </View>
          <Icon
            name="chevron-right"
            spaced={false}
            iconStyles={styles.arrowRightIcon}
            iconContainerStyles={styles.arrowRightWrapper}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImportWallet;
