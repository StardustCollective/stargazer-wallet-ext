///////////////////////
// Modules
///////////////////////

import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';

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
  // Selectors
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
      <li className={styles.assetItem} onClick={() => itemClicked()}>
        <div>
          <div className={styles.iconWrapper}>
            <img src={'/'+assetInfo.logo}></img>
          </div>
          <span>
            {assetInfo.label}
            {assetInfo.priceId &&
              fiat[assetInfo.priceId]?.price &&
              fiat[assetInfo.priceId]?.priceChange && (
                <p>
                  <small>{formatPrice(fiat[assetInfo.priceId].price)}</small>
                  {
                    <small
                      className={
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
                    </small>
                  }
                </p>
              )}
          </span>
        </div>
        <div>
          <span>
            <span>
              {formatNumber(Number(balances[asset.id]), 2, 2)}
              <b>{assetInfo.symbol}</b>
            </span>
          </span>
        </div>
      </li>
      </Card>
    </Fragment>
  );
};

export default AssetItem;
