import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import AssetHeader from 'scenes/home/Asset/AssetHeader';
import AddressLinkImage from 'assets/images/svg/addressLink.svg';
import defaultHeader from '../default';
import styles from './styles';
import IAssetHeader from './types';

const assetHeader = ({ navigation, asset, addressUrl }: IAssetHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerTitle: () => <AssetHeader asset={asset} />,
    headerRight: () => (
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();

            if (!addressUrl) return;

            Linking.openURL(addressUrl);
          }}
          style={styles.linkIcon}
        >
          <View>
            <AddressLinkImage height={moderateScale(30)} />
          </View>
        </TouchableOpacity>
      </View>
    ),
  };
};

export default assetHeader;
