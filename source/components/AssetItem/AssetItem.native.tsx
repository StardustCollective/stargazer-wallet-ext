///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View, Image } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";

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
import { getNetworkLabel, getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { IAssetInfoState } from 'state/assets/types';
import { INFTInfoState } from 'state/nfts/types';
import { IAssetState, AssetType, AssetSymbol } from 'state/vault/types';
import IAssetItem, { IAssetLogo } from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({ id, asset, assetInfo, balances, fiat, isNFT, itemClicked, showNetwork, activeNetwork }: IAssetItem) => {
  
  const netInfo = useNetInfo();

  const renderNFTPriceSection = () => {
    return <View />;
  };

  const renderAssetPriceSection = (assetInfoData: IAssetInfoState) => {

    if (showNetwork) {
      let network = assetInfoData.network;
      // 349: New network should be added here.
      if ([AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(assetInfoData?.symbol)) {
        const currentNetwork = getNetworkFromChainId(network);
        network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
      } else if (AssetSymbol.DAG === assetInfoData?.symbol) {
        network = activeNetwork.Constellation;
      }

      const label = getNetworkLabel(network);

      return (
        <View>
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>{label}</TextV3.Caption>
        </View>
      );
    }

    if (assetInfoData.priceId && fiat[assetInfoData.priceId]?.price) {
      return (
        <View style={styles.assetPrice}>
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>{formatPrice(fiat[assetInfoData.priceId].price)}</TextV3.Caption>
          {fiat[assetInfoData.priceId]?.priceChange &&
            <TextV3.Caption
            color={COLORS_ENUMS.BLACK}
            extraStyles={fiat[assetInfoData.priceId].priceChange > 0 ? styles.green : styles.red}
            >
              {fiat[assetInfoData.priceId].priceChange > 0 ? '+' : ''}
              {formatNumber(fiat[assetInfoData.priceId].priceChange, 2, 2, 3)}%
           </TextV3.Caption>
          }
        </View>
      );
    }
  };

  const renderBalance = (assetInfo: IAssetInfoState | INFTInfoState) => {
    const balanceValue = !isNFT && formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4);
    const balanceSymbol = !!balanceValue && balanceValue !== '-' ? ` ${assetInfo.symbol}` : '';
    return (
      <TextV3.CaptionRegular extraStyles={styles.balanceText} color={COLORS_ENUMS.BLACK}>
        {isNFT
          ? Number((assetInfo as INFTInfoState).quantity)
          : `${balanceValue}${balanceSymbol}`}
      </TextV3.CaptionRegular>
    );
  }

  const renderBalanceSection = (asset: IAssetState, assetInfo: IAssetInfoState | INFTInfoState) => {
    if (asset.type === AssetType.Constellation) {
      // If the balance has failed to fetch display a no connection icon.
      if (balances.constellation === undefined && !netInfo.isConnected) {
        return <NoConnectionIcon />;
      }
      return renderBalance(assetInfo);
    }
    if ([AssetType.Ethereum, AssetType.ERC20, AssetType.ERC721, AssetType.ERC1155].includes(asset.type)) {
      // If the balance has failed to fetch display a no connection icon.
      if (balances.ethereum === undefined && !netInfo.isConnected) {
        return <NoConnectionIcon />;
      }
      return renderBalance(assetInfo);
    }
  };

  const AssetIcon: FC<IAssetLogo> = React.memo(({ logo }) => {
    if (!logo) {
      return null;
    }

    if (typeof logo === 'string' && logo.startsWith('http')) {
      let iconStyle = isNFT ? styles.imageNFTIcon : styles.imageIcon;
      iconStyle = logo.includes('constellation-logo') ? styles.dagIcon : iconStyle;
      return <Image style={iconStyle} source={{ uri: logo }}/>;
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
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.labelText}>{assetInfo.label}</TextV3.CaptionStrong>
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
