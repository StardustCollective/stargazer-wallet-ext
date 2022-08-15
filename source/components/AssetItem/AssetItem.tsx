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

import styles from './AssetItem.scss';


///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({ id, asset, assetInfo, balances, fiat, isNFT, itemClicked }: IAssetItem) => {

  ///////////////////////
  // Render
  ///////////////////////

  const renderNFTPriceSection = () => {
    return <div />;
  };

  const renderAssetPriceSection = (assetInfoData: IAssetInfoState) => {
    if (assetInfoData.priceId && fiat[assetInfoData.priceId]?.price) {
      return (
        <div>
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
        </div>
      );
    }

    return null;
  };

  const classes = clsx(styles.assetItem, isNFT && styles.nft);

  return (
    <Fragment key={asset.id}>
      <Card id={`assetItem-${id}`}>
        <div className={classes} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
            {assetInfo.logo.startsWith('http') ? <img src={assetInfo.logo} /> : <img src={`/${assetInfo.logo}`} />}
          </div>
          <div className={styles.assetName}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{assetInfo.label}</TextV3.CaptionStrong>
            {isNFT ? renderNFTPriceSection() : renderAssetPriceSection(assetInfo as IAssetInfoState)}
          </div>
          <div className={styles.assetBalance}>
            <TextV3.Caption dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
              {isNFT
                ? Number((assetInfo as INFTInfoState).quantity)
                : formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4)}
            </TextV3.Caption>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
