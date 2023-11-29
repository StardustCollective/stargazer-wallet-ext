///////////////////////
// Modules
///////////////////////

import React, { FC, Fragment } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatPrice, formatStringDecimal } from 'scenes/home/helpers';
import {
  getNetworkFromChainId,
  getNetworkLabel,
} from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { IAssetInfoState } from 'state/assets/types';
import { AssetSymbol } from 'state/vault/types';
import IAssetItem from './types';

///////////////////////
// Styles
///////////////////////

import styles from './AssetItem.scss';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({
  id,
  asset,
  assetInfo,
  balances,
  fiat,
  itemClicked,
  showNetwork,
  activeNetwork,
}: IAssetItem) => {
  ///////////////////////
  // Render
  ///////////////////////

  const renderAssetPriceSection = (assetInfoData: IAssetInfoState) => {
    if (showNetwork) {
      let network = assetInfoData.network;
      // 349: New network should be added here.
      if (
        [AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(
          assetInfoData?.symbol as AssetSymbol
        )
      ) {
        const currentNetwork = getNetworkFromChainId(network);
        network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
      } else if (AssetSymbol.DAG === assetInfoData?.symbol) {
        network = activeNetwork.Constellation;
      }

      const label = getNetworkLabel(network);

      return (
        <div>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{label}</TextV3.Caption>
        </div>
      );
    }
    if (assetInfoData.priceId && fiat[assetInfoData.priceId]?.price) {
      return (
        <div>
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
            {formatPrice(fiat[assetInfoData.priceId].price)}
          </TextV3.Caption>
          {fiat[assetInfoData.priceId]?.priceChange && (
            <TextV3.Caption
              color={COLORS_ENUMS.BLACK}
              extraStyles={
                fiat[assetInfoData.priceId].priceChange > 0 ? styles.green : styles.red
              }
            >
              {fiat[assetInfoData.priceId].priceChange > 0 ? '+' : ''}
              {formatNumber(fiat[assetInfoData.priceId].priceChange, 2, 2, 3)}%
            </TextV3.Caption>
          )}
        </div>
      );
    }

    return null;
  };

  const renderBalance = (assetInfo: IAssetInfoState) => {
    const balanceValue = formatStringDecimal(
      formatNumber(Number(balances[assetInfo.id]), 16, 20),
      4
    );
    const balanceSymbol =
      !!balanceValue && balanceValue !== '-'
        ? ` ${(assetInfo as IAssetInfoState).symbol}`
        : '';

    return (
      <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
        {`${balanceValue}${balanceSymbol}`}
      </TextV3.CaptionRegular>
    );
  };

  const classes = clsx(styles.assetItem);

  return (
    <Fragment key={asset.id}>
      <Card id={`assetItem-${id}`}>
        <div className={classes} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
            {assetInfo.logo.startsWith('http') ? (
              <img src={assetInfo.logo} />
            ) : (
              <img src={`/${assetInfo.logo}`} />
            )}
          </div>
          <div className={styles.assetName}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.labelText}
            >
              {assetInfo.label}
            </TextV3.CaptionStrong>
            {renderAssetPriceSection(assetInfo as IAssetInfoState)}
          </div>
          <div className={styles.assetBalance}>{renderBalance(assetInfo)}</div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
