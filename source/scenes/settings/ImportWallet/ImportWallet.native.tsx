import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'components/Icon';
import TextV3 from 'components/TextV3';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { COLORS_ENUMS } from 'assets/styles/colors';
import IImportWalletSettings from './types';
import styles from './styles';

const ICON_SIZE = 36;

const ImportWallet: FC<IImportWalletSettings> = ({
  handleImport,
  onImportPhraseView,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        testID="importWallet-multiChainWallet"
        onPress={onImportPhraseView}
      >
        <View style={StyleSheet.flatten([styles.menu, styles.firstChild])}>
          <View style={styles.menuIconSection}>
            <StargazerIcon height={ICON_SIZE} width={ICON_SIZE} />
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
      <TouchableOpacity
        testID="importWallet-ethereum"
        onPress={handleImport(KeyringNetwork.Ethereum)}
      >
        <View style={StyleSheet.flatten([styles.menu, styles.secondChild])}>
          <View style={styles.menuIconSection}>
            <Image source={{ uri: ETHEREUM_LOGO }} style={styles.icon} />
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
      <TouchableOpacity
        testID="importWallet-constellation"
        onPress={handleImport(KeyringNetwork.Constellation)}
      >
        <View style={StyleSheet.flatten([styles.menu, styles.lastChild])}>
          <View style={styles.menuIconSection}>
            <Image source={{ uri: CONSTELLATION_LOGO }} style={styles.icon} />
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
