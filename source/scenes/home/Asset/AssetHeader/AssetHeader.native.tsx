import React, { FC } from 'react';
import { View } from 'react-native';

import CircleIcon from 'components/CircleIcon';
import TextV3 from 'components/TextV3';

import styles from './styles';

import IAssetHeaderSettings from './types';

const AssetHeader: FC<IAssetHeaderSettings> = ({ asset, network }) => {
  return (
    <View style={styles.fullselect}>
      <View style={styles.selected}>
        <View style={styles.headerSection}>
          <View style={styles.assetLogo}>
            <CircleIcon
              logo={asset.logo}
              label={asset.label}
              containerStyle={styles.assetLogo}
            />
          </View>
          <View style={styles.address}>
            <TextV3.CaptionStrong extraStyles={styles.labelText}>
              {asset?.label}
            </TextV3.CaptionStrong>
            <TextV3.Caption extraStyles={styles.addressText} id="assetHeader-address">
              {`${asset.symbol} (${network})`}
            </TextV3.Caption>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AssetHeader;
