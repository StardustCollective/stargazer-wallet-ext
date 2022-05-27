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
}) => {
  const tooltipStyle = StyleSheet.flatten([styles.address, isCopied ? styles.addressActive : {}]);

  return (
    <View style={styles.fullselect}>
      <View style={styles.selected}>
        <TouchableOpacity onPress={onClickCopyText}>
          <View style={styles.headerSection}>
            <View style={styles.assetLogo}>
              <CircleIcon
                logo={asset.logo}
                label={asset.label}
                containerStyle={styles.assetLogo}
                iconStyle={{ height: 10 }}
              />
            </View>
            {/* Add onClickCopyText function to Tooltip so it also copies when user clicks on text */}
            <Tooltip visible={isCopied} body="Copied" width={80} arrow onOpen={onClickCopyText}>
              <View style={tooltipStyle}>
                <TextV3.Header extraStyles={styles.logoHeader}>{asset.label}</TextV3.Header>
                <TextV3.Description extraStyles={styles.addressText} id="assetHeader-address">
                  {shortenedAddress}
                </TextV3.Description>
              </View>
            </Tooltip>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssetHeader;
