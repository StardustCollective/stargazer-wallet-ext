import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Tooltip from 'components/Tooltip';
import CircleIcon from 'components/CircleIcon';
import TextV3 from 'components/TextV3';

import styles from './styles';
import IAssetHeaderSettings from './types';

const AssetHeader: FC<IAssetHeaderSettings> = ({
  isCopied,
  onClickCopyText,
  shortenedAddress,
  asset,
  copiedTextToolip,
}) => {
  const tooltipStyle = StyleSheet.flatten([styles.address, isCopied ? styles.active : {}]);

  return (
    <View style={styles.fullselect}>
      <View style={styles.selected}>
        <TouchableOpacity onPress={onClickCopyText}>
          <View style={styles.main}></View>
        </TouchableOpacity>
        <View style={styles.assetLogo}>
          <CircleIcon logo={asset.logo} label={asset.label} />
        </View>
        <Tooltip title={copiedTextToolip} placement="bottom" arrow>
          <View style={tooltipStyle}>
            <TextV3.Label>{asset.label}</TextV3.Label>
            <TextV3.Description id="assetHeader-address">{shortenedAddress}</TextV3.Description>
          </View>
        </Tooltip>
      </View>
    </View>
  );
};

export default AssetHeader;
