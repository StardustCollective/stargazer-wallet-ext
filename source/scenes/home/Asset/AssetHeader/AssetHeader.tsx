import React, { FC } from 'react';

import CircleIcon from 'components/CircleIcon';

import styles from './AssetHeader.scss';

import IAssetHeaderSettings from './types';

const AssetHeader: FC<IAssetHeaderSettings> = ({ asset, network }) => {
  return (
    <div className={styles.fullselect}>
      <span className={styles.selected}>
        <span className={styles.main}>
          <div className={styles.assetLogo}>
            <CircleIcon logo={asset?.logo} label={asset?.label} />
          </div>
          <div className={styles.address}>
            <span>{asset?.label}</span>
            <small id="assetHeader-address">{`${asset.symbol} (${network})`}</small>
          </div>
          </span>
      </span>
    </div>
  );
};

export default AssetHeader;
