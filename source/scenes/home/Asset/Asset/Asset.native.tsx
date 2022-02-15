import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import * as Progress from 'react-native-progress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles.ts';

import TxsPanel from '../TxsPanel';

import IAssetSettings from './types';

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  balanceText,
  fiatAmount,
  transactions,
  onSendClick,
  assets,
}) => {
  const activeAssetStyle = StyleSheet.flatten([styles.mask, activeAsset && activeWallet ? styles.loaderHide : {}]);

  if (/*activeWallet && */ activeAsset) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.center}>
          <View style={styles.balance}>
            <TextV3.HeaderDisplay color={COLORS_ENUMS.WHITE} dynamic extraStyles={styles.balanceText}>
              {balanceText}{' '}
            </TextV3.HeaderDisplay>
            <TextV3.Body color={COLORS_ENUMS.WHITE}>{assets[activeAsset.id].symbol}</TextV3.Body>
          </View>
          <View style={styles.fiatBalance}>
            <TextV3.Body>≈ {fiatAmount}</TextV3.Body>
          </View>
          <View style={styles.actions}>
            <ButtonV3
              title="Send"
              size={BUTTON_SIZES_ENUM.LARGE}
              type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
              onPress={onSendClick}
            />
          </View>
        </View>
        <TxsPanel address={activeAsset.address} transactions={transactions} />
      </View>
    );
  }

  return (
    <View style={activeAssetStyle}>
      <Progress.Circle size={40} indeterminate color="white" />
    </View>
  );
};

export default AssetDetail;
