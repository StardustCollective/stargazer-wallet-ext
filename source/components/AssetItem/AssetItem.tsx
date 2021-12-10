///////////////////////
// Modules
///////////////////////

import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// State
///////////////////////

import { RootState } from 'state/store';

///////////////////////
// Helpers
///////////////////////

import { formatNumber, formatPrice, formatStringDecimal } from 'scenes/home/helpers';

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
import IVaultState, { IAssetState } from 'state/vault/types';
import IPriceState from 'state/price/types';

type IAssetItem = {
  id?: string;
  asset: IAssetState;
  assetInfo: IAssetInfoState;
  itemClicked: () => void;
}

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({
  id,
  asset,
  assetInfo,
  itemClicked,
}: IAssetItem) => {

  ///////////////////////
  // Hooks
  ///////////////////////

  const { balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  ///////////////////////
  // Render
  ///////////////////////
  
  return (

    <Fragment key={asset.id}>
      <Card id={`assetItem-${id}`}>
        <div className={styles.assetItem} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
           {assetInfo.logo.startsWith('http') && (
              <img src={assetInfo.logo}></img>
            )}
            {!assetInfo.logo.startsWith('http') && (
              <img src={'/'+assetInfo.logo}></img>
            )}
          </div>
          <div className={styles.assetName}>
            <TextV3.BodyStrong
              color={COLORS_ENUMS.BLACK}
            >
              {assetInfo.label}
            </TextV3.BodyStrong>
            {assetInfo.priceId &&
              fiat[assetInfo.priceId]?.price &&
              fiat[assetInfo.priceId]?.priceChange && (
                <div>
                  <TextV3.Caption
                    color={COLORS_ENUMS.BLACK}
                  >
                    {formatPrice(fiat[assetInfo.priceId].price)}
                  </TextV3.Caption>
                  {
                    <TextV3.Caption
                      color={COLORS_ENUMS.BLACK}
                      extraStyles={
                        fiat[assetInfo.priceId].priceChange > 0
                          ? styles.green
                          : styles.red
                      }
                    >
                      {fiat[assetInfo.priceId].priceChange > 0 ? '+' : ''}
                      {formatNumber(
                        fiat[assetInfo.priceId].priceChange,
                        2,
                        2,
                        3
                      )}
                      %
                    </TextV3.Caption>
                  }
                </div>
              )}
          </div>
          <div className={styles.assetBalance}>
            <TextV3.Header
              dynamic
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.balanceText}
            >
              {formatStringDecimal(formatNumber(Number(balances[asset.id]), 16, 20), 4)}
            </TextV3.Header>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
