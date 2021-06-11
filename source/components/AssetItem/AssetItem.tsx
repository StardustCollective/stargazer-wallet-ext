import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';

import { formatNumber, formatPrice } from 'containers/auth/helpers';
import { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import IPriceState from 'state/price/types';

import styles from './AssetItem.scss';
interface IAssetItem {
  asset: IAssetState;
  assetInfo: IAssetInfoState;
  itemClicked: () => void;
}

const AssetItem: FC<IAssetItem> = ({
  asset,
  assetInfo,
  itemClicked,
}: IAssetItem) => {
  const { balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  return (
    <Fragment key={asset.id}>
      <li className={styles.assetItem} onClick={() => itemClicked()}>
        <div>
          <div className={styles.iconWrapper}>
            <img src={assetInfo.logo}></img>
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
              {balances[asset.id]?.toFixed(2) || 0}
              <b>{assetInfo.symbol}</b>
            </span>
          </span>
        </div>
      </li>
    </Fragment>
  );
};

export default AssetItem;
