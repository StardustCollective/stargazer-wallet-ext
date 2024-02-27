import React, { FC } from 'react';
import { View, TouchableOpacity, Linking, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import TextV3 from 'components/TextV3';
import TxReceivedIcon from 'assets/images/svg/tx-received.svg';
import TxSentIcon from 'assets/images/svg/tx-sent.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ellipsis } from 'scenes/home/helpers';
import styles from './styles';
import ITxItemSettings, { RenderIconProps } from './types';

const RenderIcon: FC<RenderIconProps> = ({ tx, isETH, isReceived, isRewardsTab }) => {
  const { checkpointBlock, blockHash, assetId } = tx;
  if (!isETH) {
    // checkpointBlock is V1 and blockHash is V2
    if (checkpointBlock || blockHash || isRewardsTab) {
      return isReceived ? <TxReceivedIcon /> : <TxSentIcon />;
    }
    return <Progress.Circle size={16} indeterminate />;
  }

  if (!assetId) {
    return isReceived ? <TxReceivedIcon /> : <TxSentIcon />;
  }

  return <Progress.Circle size={16} indeterminate />;
};

const TxItem: FC<ITxItemSettings> = ({
  tx,
  isETH,
  isRewardsTab,
  isReceived,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  amount,
  fiatAmount,
  getLinkUrl,
  receivedOrSentText,
  formattedDistanceDate,
  renderGasSettings,
  logo,
}) => {
  const sign = isReceived ? '+' : '-';

  const handleOnPress = (e) => {
    e.stopPropagation();

    if (!getLinkUrl) {
      return;
    }

    const url = getLinkUrl(tx);

    if (!url) {
      return;
    }

    Linking.openURL(url);
  };

  return (
    <TouchableOpacity disabled={isRewardsTab} onPress={handleOnPress}>
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
              <RenderIcon
                tx={tx}
                isETH={isETH}
                isReceived={isReceived}
                isRewardsTab={isRewardsTab}
              />
              <View style={styles.logoContainer}>
                <Image source={{ uri: logo }} style={styles.logo} />
              </View>
            </View>
            <View style={styles.txInfoWrapper}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                {receivedOrSentText}
              </TextV3.CaptionStrong>
              {!!txTypeLabel && (
                <TextV3.Caption extraStyles={styles.txAddress}>
                  {ellipsis(txTypeLabel)}
                </TextV3.Caption>
              )}
            </View>
          </View>
          <View style={styles.txAmountWrapper}>
            <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
              {sign}
              {amount}
            </TextV3.CaptionRegular>
            <TextV3.Caption
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.txAmountFiatText}
              numberOfLines={1}
            >
              {fiatAmount}
            </TextV3.Caption>
          </View>
        </View>
        {isGasSettingsVisible && (
          <View style={styles.gasSettings}>{renderGasSettings()}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TxItem;
