import React, { FC } from 'react';
import clsx from 'clsx';

import Tooltip from 'components/Tooltip';
import { ellipsis } from 'containers/auth/helpers';
import { useCopyClipboard } from 'hooks/index';

import styles from './AssetHeader.scss';
import { IAssetInfoState } from 'state/assets/types';

interface IAssetHeader {
  asset: IAssetInfoState;
  address: string;
}

const AssetHeader: FC<IAssetHeader> = ({ asset, address }) => {
  const [isCopied, copyText] = useCopyClipboard();

  return (
    <div className={styles.fullselect}>
      <span className={styles.selected}>
        <span
          className={styles.main}
          onClick={(e) => {
            e.stopPropagation();
            copyText(address);
          }}
        >
          <div className={styles.logoWrapper}>
            <img src={asset.logo} alt={asset.label} height="17" />
          </div>
          <Tooltip
            title={isCopied ? 'Copied' : 'Copy Address '}
            placement="bottom"
            arrow
          >
            <div
              className={clsx(styles.address, { [styles.active]: isCopied })}
            >
              <span>{asset.label}</span>
              <small>{ellipsis(address)}</small>
            </div>
          </Tooltip>
        </span>
      </span>
    </div>
  );
};

export default AssetHeader;
