///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import defaultHeader from '../default';
import AssetHeader from 'scenes/home/Asset/AssetHeader';
import IconButton from '@material-ui/core/IconButton';
import addressLinkImage from 'assets/images/svg/addressLink.svg';
import { IAssetInfoState } from 'state/assets/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './asset.scss';

///////////////////////////
// Interface
///////////////////////////

interface IAssetHeader {
  navigation: any;
  asset: IAssetInfoState;
  addressUrl: string;
  onQrCodePress?: () => void;
}

///////////////////////////
// Header
///////////////////////////

const assetHeader = ({ navigation, asset, addressUrl }: IAssetHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerTitle: () => <AssetHeader asset={asset} />,
    headerRight: () => (
      <IconButton
        className={styles.linkIcon}
        onClick={(e) => {
          e.stopPropagation();

          if (!addressUrl) return;

          window.open(addressUrl, '_blank');
        }}
      >
        <img src={'/' + addressLinkImage} height="32" />
      </IconButton>
    ),
  };
};

export default assetHeader;
