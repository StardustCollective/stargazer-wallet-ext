import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';

import AssetHeader from 'scenes/home/Asset/AssetHeader';
import AddressLinkImage from 'assets/images/svg/addressLink.svg';

import defaultHeader from '../default';
import styles from './styles';

import IAssetHeader from './types';

const assetHeader = ({ navigation, asset, address, addressUrl }: IAssetHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerTitle: () => <AssetHeader asset={asset} address={address} />,
    headerRight: () => (
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          Linking.openURL(addressUrl);
        }}
      >
        <View>
          <AddressLinkImage height={32} iconStyles={styles.linkIcon} />
        </View>
      </TouchableOpacity>
    ),
  };
};

export default assetHeader;
