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
                iconStyle={{ height: 10 }}
              />
            </View>
            <View style={styles.address}>
              <TextV3.Header extraStyles={styles.logoHeader}>{asset?.label}</TextV3.Header>
              <TextV3.Description extraStyles={styles.addressText} id="assetHeader-address">
                {`${asset.symbol} (${network})`}
              </TextV3.Description>
            </View>
          </View>
      </View>
    </View>
  );
};

export default AssetHeader;
