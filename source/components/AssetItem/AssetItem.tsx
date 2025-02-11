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

import { formatNumber, formatPrice } from 'scenes/home/helpers';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import { IAssetInfoState } from 'state/assets/types';
import IAssetItem from './types';

///////////////////////
// Styles
///////////////////////

import styles from './AssetItem.scss';
import LoadingDots from 'components/LoadingDots';

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({
  id,
  asset,
  assetInfo,
  balance,
  assetPrice,
  itemClicked,
  showNetwork,
  networkLabel,
  showPrice,
  loading,
}: IAssetItem) => {
  ///////////////////////
  // Render
  ///////////////////////

  const renderAssetNetwork = () => {
    return (
      <div>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{networkLabel}</TextV3.Caption>
      </div>
    );
  };

  const renderAssetPrice = () => {
    if (assetInfo?.priceId && assetPrice?.price) {
      return (
        <div>
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
        </div>
      );
    }

    return null;
  };

  const renderBalance = () => {
    const balanceSymbol =
      !!balance && balance !== '-' ? ` ${(assetInfo as IAssetInfoState).symbol}` : '';

    if (loading) {
      return <LoadingDots color="#5030cc" width={30} height={6} />;
    }

    return (
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
        {`${balance}${balanceSymbol}`}
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
