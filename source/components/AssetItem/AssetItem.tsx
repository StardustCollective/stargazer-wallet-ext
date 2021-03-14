import React, { FC, Fragment } from 'react';
import { v4 as uuid } from 'uuid';

import { formatNumber } from 'containers/auth/helpers';
import { IAssetInfoState } from 'state/assets/types';

import styles from './AssetItem.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';

interface IAssetItem {
  asset: IAssetInfoState;
  itemClicked: () => void;
}

const AssetItem: FC<IAssetItem> = ({ asset, itemClicked }: IAssetItem) => {
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

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
            <p>
              <small>{formatNumber(0)}</small>
              <small className={1 ? styles.green : styles.red}>
                {1 > 0 ? '+' : ''}
                {formatNumber(0)}%
              </small>
            </p>
          </span>
        </div>
        <div>
          <span>
            <span>
              {account.assets[asset.symbol]?.balance || 0}
              <b>{asset.symbol}</b>
            </span>
          </span>
        </div>
      </li>
    </Fragment>
  );
};

export default AssetItem;
