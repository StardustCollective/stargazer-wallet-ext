import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { formatNumber } from 'containers/auth/helpers';
import { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import IPriceState from 'state/price/types';

import styles from './AssetItem.scss';
interface IAssetItem {
  asset: IAssetInfoState;
  itemClicked: () => void;
}

const AssetItem: FC<IAssetItem> = ({ asset, itemClicked }: IAssetItem) => {
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);

  const account = accounts[activeAccountId];

  return (
    <Fragment key={uuid()}>
      <li className={styles.assetItem} onClick={() => itemClicked()}>
        <div>
          <div className={styles.iconWrapper}>
            <img src={asset.logo}></img>
          </div>
          <span>
            {asset.name}
            {asset.priceId &&
              fiat[asset.priceId]?.price &&
              fiat[asset.priceId]?.priceChange && (
                <p>
                  <small>{formatNumber(fiat[asset.priceId].price)}</small>
                  {
                    <small
                      className={
                        fiat[asset.priceId].priceChange > 0
                          ? styles.green
                          : styles.red
                      }
                    >
                      {fiat[asset.priceId].priceChange > 0 ? '+' : ''}
                      {formatNumber(fiat[asset.priceId].priceChange, 2, 2, 3)}%
                    </small>
                  }
                </p>
              )}
          </span>
        </div>
        <div>
          <span>
            <span>
              {account.assets[asset.id]?.balance.toFixed(2) || 0}
              <b>{asset.symbol}</b>
            </span>
          </span>
        </div>
      </li>
    </Fragment>
  );
};

export default AssetItem;
