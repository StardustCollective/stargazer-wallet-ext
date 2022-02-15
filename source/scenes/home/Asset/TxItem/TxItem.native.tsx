import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import * as Progress from 'react-native-progress';

import TextV3 from 'components/TextV3';
import { Transaction } from 'state/vaults/types';

import TxIcon from 'assets/images/svg/txIcon.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import ITxItemSettings from './types';

const RenderIcon: FC = (tx: Transaction, isETH: boolean, isReceived: boolean) => {
  const { checkpointBlock, assetId } = tx;
  // not ETH && checkpointBlock && isReceived => styles.recIcon
  // not ETH && tx.checkpointBlock && !isReceived => TxIcon
  // not ETH && !tx.checkpointBlock => Spinner
  if (!isETH) {
    if (checkpointBlock) {
      if (isReceived) {
        return <TxIcon iconStyles={styles.recvIcon} />;
      }
      return <TxIcon />;
    }
    return <Progress.Circle size={24} indeterminate={true} />;
  }

  // no tx.assetId && isReceived => styles.received
  // no tx.assetId && !isReceived => icon
  // tx.assetId => Spinner

  if (!assetId) {
    if (isReceived) {
      return <TxIcon iconStyles={styles.recvIcon} />;
    }
    return <TxIcon />;
  }

  return <Progress.Circle size={24} indeterminate={true} />;
};

const TxItem: FC<ITxItemSettings> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  amount,
  fiatAmount,
  onItemClick,
  receivedOrSentText,
  formattedDistanceDate,
  renderGasSettings,
}) => {
  return (
    <TouchableOpacity onPress={() => onItemClick(tx.hash)}>
      <View style={styles.txItem}>
        {showGroupBar && (
          <View style={styles.groupBar}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{formattedDistanceDate}</TextV3.CaptionStrong>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.txIcon}>
            <View style={styles.iconCircle}>
              <RenderIcon />
            </View>
          </View>
          <View style={styles.txInfo}>
            <View>
              <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{receivedOrSentText}</TextV3.BodyStrong>
            </View>
            <View>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{txTypeLabel}</TextV3.Caption>
            </View>
          </View>
          <View style={styles.txAmount}>
            <TextV3.BodyStrong dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountText}>
              {amount}
            </TextV3.BodyStrong>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountFiatText}>
              ≈ {fiatAmount}
            </TextV3.Caption>
          </View>
        </View>
        {/* {isGasSettingsVisible && <View style={styles.gasSettings}>{renderGasSettings()}</View>} */}
      </View>
    </TouchableOpacity>
  );
};

export default TxItem;
