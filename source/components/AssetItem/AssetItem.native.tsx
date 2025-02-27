///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View, Image } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';
import LoadingDots from 'components/LoadingDots';

///////////////////////
// Images
///////////////////////

import NoConnectionIcon from 'assets/images/svg/no-connection.svg';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatPrice } from 'scenes/home/helpers';
import {
  getNetworkLabel,
  getNetworkFromChainId,
} from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { AssetType, AssetSymbol } from 'state/vault/types';
import IAssetItem, { IAssetLogo } from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({
  asset,
  assetInfo,
  balance,
  assetPrice,
  loading,
  itemClicked,
  showNetwork,
  showPrice,
  activeNetwork,
}: IAssetItem) => {
  const netInfo = useNetInfo();

  const renderAssetPrice = () => {
    if (assetInfo?.priceId && assetPrice?.price) {
      return (
        <View style={styles.assetPrice}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            {formatPrice(assetPrice.price)}
          </TextV3.Caption>
          {assetPrice.priceChange && (
            <TextV3.Caption
              color={COLORS_ENUMS.BLACK}
              extraStyles={assetPrice.priceChange > 0 ? styles.green : styles.red}
            >
              {assetPrice.priceChange > 0 ? '+' : ''}
              {formatNumber(assetPrice.priceChange, 2, 2, 3)}%
            </TextV3.Caption>
          )}
        </View>
      );
    }
    return null;
  };

  const renderAssetNetwork = () => {
    let { network } = assetInfo;
    // 349: New network should be added here.
    if (
      [AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(
        assetInfo?.symbol
      )
    ) {
      const currentNetwork = getNetworkFromChainId(network);
      network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
    } else if (AssetSymbol.DAG === assetInfo?.symbol) {
      network = activeNetwork.Constellation;
    }

    const label = getNetworkLabel(network);

    return (
      <View>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{label}</TextV3.Caption>
      </View>
    );
  };

  const renderBalanceValue = () => {
    const balanceSymbol = !!balance && balance !== '-' ? ` ${assetInfo.symbol}` : '';

    if (loading) {
      return <LoadingDots containerHeight={20} color="#5030cc" height={6} />;
    }
    return (
      <TextV3.CaptionStrong extraStyles={styles.balanceText} color={COLORS_ENUMS.BLACK}>
        {`${balance}${balanceSymbol}`}
      </TextV3.CaptionStrong>
    );
  };

  const renderBalance = () => {
    if (asset.type === AssetType.Constellation) {
      // If the balance has failed to fetch display a no connection icon.
      if (!netInfo.isConnected) {
        return <NoConnectionIcon />;
      }
      return renderBalanceValue();
    }
    if ([AssetType.Ethereum, AssetType.ERC20].includes(asset.type)) {
      // If the balance has failed to fetch display a no connection icon.
      if (!netInfo.isConnected) {
        return <NoConnectionIcon />;
      }
      return renderBalanceValue();
    }

    return null;
  };

  const AssetIcon: FC<IAssetLogo> = React.memo(({ logo }) => {
    if (!logo) {
      return null;
    }

    if (typeof logo === 'string' && logo.startsWith('http')) {
      return <Image style={styles.imageIcon} source={{ uri: logo }} />;
    }

    const LogoComponent = logo;
    return <LogoComponent iconStyle={styles.imageIcon} />;
  });

  return (
    <Card style={styles.cardContainer} onClick={itemClicked}>
      <View style={styles.assetIcon}>
        <AssetIcon logo={assetInfo?.logo} />
      </View>
      <View style={styles.assetName}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          {assetInfo.label}
        </TextV3.CaptionStrong>
        {showNetwork ? renderAssetNetwork() : renderAssetPrice()}
      </View>
      <View style={styles.balanceContainer}>
        <View style={styles.assetBalance}>{renderBalance()}</View>
        {showPrice && <View style={styles.assetPriceRight}>{renderAssetPrice()}</View>}
      </View>
    </Card>
  );
};

export default AssetItem;
