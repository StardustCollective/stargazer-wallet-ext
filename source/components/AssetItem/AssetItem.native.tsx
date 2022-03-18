///////////////////////
// Modules
///////////////////////

import React, { FC, useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import {useNetInfo} from "@react-native-community/netinfo";

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import NoConnectionIcon from 'assets/images/svg/no-connection.svg'

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
import IAssetItem, { IAssetLogo } from './types';
import { IAssetState, AssetType } from 'state/vault/types';

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import IProcessState from 'state/process/types';
import { ProcessStates } from 'state/process/enums';


///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({ id, asset, assetInfo, balances, fiat, isNFT, itemClicked }: IAssetItem) => {
  
  const { fetchDagBalance }: IProcessState = useSelector((state: RootState) => state.process);
  const [isConnected, setIsConnected] = useState(true);
  const netInfo = useNetInfo();

  const renderNFTPriceSection = () => {
    return <View />;
  };

  const renderAssetPriceSection = (assetInfoData: IAssetInfoState) => {
    if (assetInfoData.priceId && fiat[assetInfoData.priceId]?.price && fiat[assetInfoData.priceId]?.priceChange) {
      return (
        <View style={styles.assetPrice}>
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
  };

  const renderBalance = (assetInfo: IAssetInfoState | INFTInfoState) => {
    return (
      <TextV3.Header dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
        {isNFT
          ? Number((assetInfo as INFTInfoState).quantity)
          : formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4)}
      </TextV3.Header>
    );
  }

  const renderBalanceSection = (asset: IAssetState, assetInfo: IAssetInfoState | INFTInfoState) => {

    if (asset.type === AssetType.Constellation) {
      // If the balance has failed to fetch display a no connection icon.
      if (balances.constellation === undefined && !netInfo.isConnected) {
        return (<NoConnectionIcon />)
      } else {
        return (renderBalance(assetInfo));
      }
    } else if (asset.type === AssetType.Ethereum || asset.type === AssetType.ERC20) {
      // If the balance has failed to fetch display a no connection icon.
      if (balances.ethereum === undefined && !netInfo.isConnected ) {
        return (<NoConnectionIcon />)
      } else {
        return (renderBalance(assetInfo));
      }
    }

  }

  const AssetIcon: FC<IAssetLogo> = React.memo(({ logo }) => {
    if (!logo) {
      return null;
    }

    if (typeof logo === 'string' && logo.startsWith('http')) {
      return <Image style={styles.imageIcon} source={{ uri: logo }} />;
    }

    const LogoComponent = logo;
    return <LogoComponent iconStyle={styles.componentIcon} />;
  });

  // const classes = clsx(styles.assetItem, isNFT && styles.nft);
  return (
    <Card style={{ width: '100%' }} onClick={itemClicked}>
      <View style={styles.assetIcon}>
        <AssetIcon logo={assetInfo?.logo} />
      </View>
      <View style={styles.assetName}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{assetInfo.label}</TextV3.BodyStrong>
        {isNFT ? renderNFTPriceSection() : renderAssetPriceSection(assetInfo as IAssetInfoState)}
      </View>
      <View style={styles.assetBalance}>
        {renderBalanceSection(asset, assetInfo)}
      </View>
    </Card>
  );
};

export default AssetItem;
``;
