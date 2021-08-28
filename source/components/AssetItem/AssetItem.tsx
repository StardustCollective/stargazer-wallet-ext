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

import { formatNumber, formatPrice } from 'scenes/home/helpers';

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
  asset: IAssetState;
  assetInfo: IAssetInfoState;
  itemClicked: () => void;
}

///////////////////////
// Component
///////////////////////

const AssetItem: FC<IAssetItem> = ({
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
      <Card>
        <div className={styles.assetItem} onClick={() => itemClicked()}>
          <div className={styles.assetIcon}>
            <img src={'/' + assetInfo.logo}></img>
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
             color={COLORS_ENUMS.BLACK}
            >
              {formatNumber(Number(balances[asset.id]), 2, 2)}
            </TextV3.Header>
            <TextV3.Caption
             color={COLORS_ENUMS.BLACK}
            >
              {assetInfo.symbol}
            </TextV3.Caption>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
