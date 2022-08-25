import React, { FC } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';

import * as Progress from 'react-native-progress';

import TextV3 from 'components/TextV3';

import TxIcon from 'assets/images/svg/txIcon.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import ITxItemSettings, { RenderIconProps } from './types';
import { ellipsis } from 'scenes/home/helpers';

const RenderIcon: FC<RenderIconProps> = ({ tx, isETH }) => {
  const { checkpointBlock, assetId } = tx;
  // removing logic about isReceived because we do not have styling for txIcon if received
  if (!isETH) {
    if (checkpointBlock) {
      return <TxIcon />;
    }
    return <Progress.Circle size={24} indeterminate />;
  }

  if (!assetId) {
    return <TxIcon />;
  }

  return <Progress.Circle size={24} indeterminate />;
};

const TxItem: FC<ITxItemSettings> = ({
  tx,
  isETH,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  amount,
  fiatAmount,
  getLinkUrl,
  receivedOrSentText,
  formattedDistanceDate,
  renderGasSettings,
}) => {
  return (
    <TouchableOpacity onPress={(e) => {
      e.stopPropagation();
      const url = getLinkUrl(tx.hash);

      if (!url) {
        return;
      }

      Linking.openURL(url);
    }}>
      <View style={styles.txItem}>
        {showGroupBar && (
          <View style={styles.groupBar}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.groupBarText}>
              {formattedDistanceDate}
            </TextV3.Caption>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.iconCircle}>
              <RenderIcon tx={tx} isETH={isETH} />
            </View>
            <View style={styles.txInfoWrapper}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.statusText}>{receivedOrSentText}</TextV3.CaptionStrong>
              <TextV3.Caption extraStyles={styles.txAddress}>
                {ellipsis(txTypeLabel)}
              </TextV3.Caption>
            </View>
          </View>
          <View style={styles.txAmountWrapper}>
            <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
              {amount}
            </TextV3.CaptionRegular>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountFiatText} numberOfLines={1}>
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
