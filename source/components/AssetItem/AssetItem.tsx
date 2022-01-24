///////////////////////
// Modules
///////////////////////

import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// State
///////////////////////

import { RootState } from 'state/store';
import { AssetType } from 'state/vault/types';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatPrice, formatStringDecimal } from 'scenes/home/helpers';

const isAssetNFT = (assetInfo: any) => {
  return [AssetType.ERC721, AssetType.ERC1155].includes(assetInfo.type);
};

///////////////////////
// Styles
///////////////////////

import styles from './AssetItem.scss';

///////////////////////
// Enums
///////////////////////
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////
import { IAssetInfoState } from 'state/assets/types';
import { INFTInfoState } from 'state/nfts/types';
import IVaultState, { IAssetState } from 'state/vault/types';
import IPriceState from 'state/price/types';

type IAssetItem = {
  id?: string;
  asset: IAssetState;
  assetInfo: IAssetInfoState | INFTInfoState;
  itemClicked: () => void;
};

///////////////////////
// Component
///////////////////////
const AssetItem: FC<IAssetItem> = ({ id, asset, assetInfo, itemClicked }: IAssetItem) => {
  ///////////////////////
  // Hooks
  ///////////////////////
  const { balances }: IVaultState = useSelector((state: RootState) => state.vault);
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  const isNFT = isAssetNFT(assetInfo);

  ///////////////////////
  // Render
  ///////////////////////
  const renderNFTPriceSection = () => {
    return <div></div>;
  };

  const renderAssetPriceSection = (assetInfo: IAssetInfoState) => {
    return (
      <>
        {assetInfo.priceId && fiat[assetInfo.priceId]?.price && fiat[assetInfo.priceId]?.priceChange && (
          <div>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>{formatPrice(fiat[assetInfo.priceId].price)}</TextV3.Caption>
            {
              <TextV3.Caption
                color={COLORS_ENUMS.BLACK}
                extraStyles={fiat[assetInfo.priceId].priceChange > 0 ? styles.green : styles.red}
              >
                {fiat[assetInfo.priceId].priceChange > 0 ? '+' : ''}
                {formatNumber(fiat[assetInfo.priceId].priceChange, 2, 2, 3)}%
              </TextV3.Caption>
            }
          </div>
        )}
      </>
    );
  };

  const classes = clsx(
    styles.assetItem,
    isNFT && styles.nft
  );

  return (
    <Fragment key={asset.id}>
      <Card id={`assetItem-${id}`}>
        <div className={classes} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
            {assetInfo.logo.startsWith('http') ? (
              <img src={assetInfo.logo}></img>
            ) : (
              <img src={'/' + assetInfo.logo}></img>
            )}
          </div>
          <div className={styles.assetName}>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{assetInfo.label}</TextV3.BodyStrong>
            {isNFT ? renderNFTPriceSection() : renderAssetPriceSection(assetInfo as IAssetInfoState)}
          </div>
          <div className={styles.assetBalance}>
            <TextV3.Header dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.balanceText}>
              {isNFT
                ? Number((assetInfo as INFTInfoState).quantity)
                : formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4)}
            </TextV3.Header>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
