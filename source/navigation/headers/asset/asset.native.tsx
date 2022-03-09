import React from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';

import AssetHeader from 'scenes/home/Asset/AssetHeader';
import AddressLinkImage from 'assets/images/svg/addressLink.svg';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import { COLORS } from 'assets/styles/_variables';
import defaultHeader from '../default';
import styles from './styles';

import IAssetHeader from './types';


const ICON_SIZE = 25

const assetHeader = ({ navigation, asset, address, addressUrl, onQrCodePress }: IAssetHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerTitle: () => <AssetHeader asset={asset} address={address} />,
    headerRight: () => (
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onQrCodePress}>
          <View style={styles.qrIcon}>
            <QRCodeIcon height={ICON_SIZE} width={ICON_SIZE} fill={COLORS.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(addressUrl);
          }}
          style={styles.linkIcon}
        >
          <View >
            <AddressLinkImage height={32} />
          </View>
        </TouchableOpacity>
      </View>

    ),
  };
};

export default assetHeader;
