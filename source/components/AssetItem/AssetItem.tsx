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
  showPrice,
}: IAssetItem) => {
  ///////////////////////
  // Render
  ///////////////////////

  const renderAssetNetwork = () => {
    let { network } = assetInfo;
    // 349: New network should be added here.
    if (
      [AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(
        assetInfo?.symbol as AssetSymbol
      )
    ) {
      const currentNetwork = getNetworkFromChainId(network);
      network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
    } else if (AssetSymbol.DAG === assetInfo?.symbol) {
      network = activeNetwork.Constellation;
    }

    const label = getNetworkLabel(network);

    return (
      <div>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{label}</TextV3.Caption>
      </div>
    );
  };

  const renderAssetPrice = () => {
    if (assetInfo.priceId && fiat[assetInfo.priceId]?.price) {
      return (
        <div>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            {formatPrice(fiat[assetInfo.priceId].price)}
          </TextV3.Caption>
          {fiat[assetInfo.priceId]?.priceChange && (
            <TextV3.Caption
              color={COLORS_ENUMS.BLACK}
              extraStyles={
                fiat[assetInfo.priceId].priceChange > 0 ? styles.green : styles.red
              }
            >
              {fiat[assetInfo.priceId].priceChange > 0 ? '+' : ''}
              {formatNumber(fiat[assetInfo.priceId].priceChange, 2, 2, 3)}%
            </TextV3.Caption>
          )}
        </div>
      );
    }

    return null;
  };

  const renderBalance = () => {
    const balanceValue = formatStringDecimal(
      formatNumber(Number(balances[assetInfo.id]), 16, 20),
      4
    );
    const balanceSymbol =
      !!balanceValue && balanceValue !== '-'
        ? ` ${(assetInfo as IAssetInfoState).symbol}`
        : '';

    return (
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
        {`${balanceValue}${balanceSymbol}`}
      </TextV3.CaptionStrong>
    );
  };

  const classes = clsx(styles.assetItem);

  return (
    <Fragment key={asset.id}>
      <Card id={`assetItem-${id}`}>
        <div className={classes} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
            {assetInfo.logo.startsWith('http') ? (
              <img src={assetInfo.logo} alt="asset logo" />
            ) : (
              <img src={`/${assetInfo.logo}`} alt="asset logo" />
            )}
          </div>
          <div className={styles.assetName}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              {assetInfo.label}
            </TextV3.CaptionStrong>
            {showNetwork ? renderAssetNetwork() : renderAssetPrice()}
          </div>
          <div className={styles.balanceContainer}>
            <div className={styles.assetBalance}>{renderBalance()}</div>
            {showPrice && <div>{renderAssetPrice()}</div>}
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
