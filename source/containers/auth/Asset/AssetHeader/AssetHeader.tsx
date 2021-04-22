import React, { FC } from 'react';
import clsx from 'clsx';
import LinkIcon from '@material-ui/icons/CallMade';
import IconButton from '@material-ui/core/IconButton';

import Tooltip from 'components/Tooltip';
import { ellipsis } from 'containers/auth/helpers';
import { useCopyClipboard } from 'hooks/index';

import styles from './AssetHeader.scss';
import { IAssetInfoState } from 'state/assets/types';

interface IAssetHeader {
  asset: IAssetInfoState;
  address: string;
  addressUrl: string;
}

const AssetHeader: FC<IAssetHeader> = ({ asset, address, addressUrl }) => {
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
            <img src={asset.logo} alt={asset.name} height="36" />
          </div>
          <Tooltip
            title={isCopied ? 'Copied' : 'Copy Address '}
            placement="bottom"
            arrow
          >
            <div
              className={clsx(styles.address, { [styles.active]: isCopied })}
            >
              {asset.name}
              <small>{ellipsis(address)}</small>
            </div>
          </Tooltip>
        </span>
        <IconButton
          className={styles.linkIcon}
          onClick={(e) => {
            e.stopPropagation();
            window.open(addressUrl, '_blank');
          }}
        >
          <LinkIcon />
        </IconButton>
      </span>
    </div>
  );
};

export default AssetHeader;
