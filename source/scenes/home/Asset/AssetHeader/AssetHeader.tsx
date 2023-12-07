import React, { FC } from 'react';

import CircleIcon from 'components/CircleIcon';
import TextV3 from 'components/TextV3';

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
            <TextV3.CaptionStrong extraStyles={styles.labelText}>
              {asset?.label}
            </TextV3.CaptionStrong>
            <TextV3.Caption
              extraStyles={styles.networkText}
            >{`${asset.symbol} (${network})`}</TextV3.Caption>
          </div>
        </span>
      </span>
    </div>
  );
};

export default AssetHeader;
