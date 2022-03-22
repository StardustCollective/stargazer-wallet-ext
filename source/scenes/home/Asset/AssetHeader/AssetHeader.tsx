import React, { FC } from 'react';
import clsx from 'clsx';

import Tooltip from 'components/Tooltip';
import CircleIcon from 'components/CircleIcon';

import styles from './AssetHeader.scss';

import IAssetHeaderSettings from './types';

const AssetHeader: FC<IAssetHeaderSettings> = ({
  isCopied,
  onClickCopyText,
  shortenedAddress,
  asset,
  copiedTextToolip,
}) => {
  return (
    <div className={styles.fullselect}>
      <span className={styles.selected}>
        <span className={styles.main} onClick={onClickCopyText}>
          <div className={styles.assetLogo}>
            <CircleIcon logo={asset.logo} label={asset.label} />
          </div>
          <Tooltip title={copiedTextToolip} placement="bottom" arrow>
            <div className={clsx(styles.address, { [styles.active]: isCopied })}>
              <span>{asset.label}</span>
              <small id="assetHeader-address">{shortenedAddress}</small>
            </div>
          </Tooltip>
        </span>
      </span>
    </div>
  );
};

export default AssetHeader;
