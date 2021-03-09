import React, { FC, Fragment } from 'react';
import { v4 as uuid } from 'uuid';

import { formatNumber } from 'containers/auth/helpers';
import { Asset } from 'types/asset';

import styles from './AssetItem.scss';

interface IAssetItem {
  asset: Asset;
  itemClicked: () => void;
}

const AssetItem: FC<IAssetItem> = ({ asset, itemClicked }: IAssetItem) => {
  return (
    <Fragment key={uuid()}>
      <li className={styles.assetItem} onClick={() => itemClicked()}>
        <div>
          <div className={styles.iconWrapper}>
            <img src={asset.logo}></img>
          </div>
          <span>
            {asset.name}
            <p>
              <small>{formatNumber(asset.price)}</small>
              <small
                className={asset.priceChange > 0 ? styles.green : styles.red}
              >
                {asset.priceChange > 0 ? '+' : ''}
                {formatNumber(asset.priceChange)}%
              </small>
            </p>
          </span>
        </div>
        <div>
          <span>
            <span>
              {asset.balance}
              <b>{asset.shortName}</b>
            </span>
          </span>
        </div>
      </li>
    </Fragment>
  );
};

export default AssetItem;
