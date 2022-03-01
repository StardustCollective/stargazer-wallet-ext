import React, { FC } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native';

import * as Progress from 'react-native-progress';

import TextV3 from 'components/TextV3';

import TxIcon from 'assets/images/svg/txIcon.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import ITxItemSettings, { RenderIconProps } from './types';
import { useLinking } from '@react-navigation/native';

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
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.groupBarText}>
              {formattedDistanceDate}
            </TextV3.CaptionStrong>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.iconCircle}>
              <RenderIcon tx={tx} isETH={isETH} />
            </View>
            <View style={styles.txInfoWrapper}>
              <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{receivedOrSentText}</TextV3.BodyStrong>
              <Text numberOfLines={1} style={styles.txAddress}>
                {txTypeLabel}
              </Text>
            </View>
          </View>
          <View style={styles.txAmountWrapper}>
            <Text style={styles.txAmountText} numberOfLines={1}>
              {amount}
            </Text>
            <Text style={styles.txAmountFiatText} numberOfLines={1}>
              ≈ {fiatAmount}
            </Text>
          </View>
        </View>
        {isGasSettingsVisible && <View style={styles.gasSettings}>{renderGasSettings()}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default TxItem;
