///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatPrice, formatStringDecimal } from 'scenes/home/helpers';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { IAssetInfoState } from 'state/assets/types';
import { INFTInfoState } from 'state/nfts/types';
import IAssetItem from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({ id, asset, assetInfo, balances, fiat, isNFT, itemClicked }: IAssetItem) => {

  const renderNFTPriceSection = () => {
    return <View />;
  };

  const renderAssetPriceSection = (assetInfoData: IAssetInfoState) => {
    if (assetInfoData.priceId && fiat[assetInfoData.priceId]?.price && fiat[assetInfoData.priceId]?.priceChange) {
      return (
        <View>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>{formatPrice(fiat[assetInfoData.priceId].price)}</TextV3.Caption>
          <TextV3.Caption
            color={COLORS_ENUMS.BLACK}
            extraStyles={fiat[assetInfoData.priceId].priceChange > 0 ? styles.green : styles.red}
          >
            {fiat[assetInfoData.priceId].priceChange > 0 ? '+' : ''}
            {formatNumber(fiat[assetInfoData.priceId].priceChange, 2, 2, 3)}%
          </TextV3.Caption>
        </View>
      );
    }
  }

  // const classes = clsx(styles.assetItem, isNFT && styles.nft);
  return (

    <Card style={{width:'100%'}} onClick={itemClicked}>
      <View style={styles.assetIcon}>
        {typeof assetInfo.logo === 'string' && assetInfo.logo.startsWith('http') ?
          (<Image style={styles.imageIcon} source={{ uri: assetInfo.logo }} />)
          :
          (<assetInfo.logo style={styles.componentIcon} />)
        }
      </View>
      <View style={styles.assetName}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{assetInfo.label}</TextV3.BodyStrong>
        {isNFT ? renderNFTPriceSection() : renderAssetPriceSection(assetInfo as IAssetInfoState)}
      </View>
      <View style={styles.assetBalance}>
        <TextV3.Header dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
          {isNFT
            ? Number((assetInfo as INFTInfoState).quantity)
            : formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4)}
        </TextV3.Header>
      </View>
    </Card>
  );

}

export default AssetItem;``