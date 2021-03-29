import React, { useState, FC } from 'react';
import clsx from 'clsx';
import DownArrowIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LinkIcon from '@material-ui/icons/CallMissedOutgoing';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@devneser/gradient-avatar';

import AssetItem from 'components/AssetItem';
import Tooltip from 'components/Tooltip';
import { ellipsis } from 'containers/auth/helpers';
import { useCopyClipboard } from 'hooks/index';
import { IAssetInfoState } from 'state/assets/types';

import styles from './AssetSelect.scss';

interface IAssetSelect {
  assetList: Array<IAssetInfoState>;
  tokenName: string;
  tokenAddress: string;
  addressUrl: string;
  onChange: (value: IAssetInfoState) => void;
}

const AssetSelect: FC<IAssetSelect> = ({
  assetList,
  tokenName,
  tokenAddress,
  addressUrl,
  onChange,
}: IAssetSelect) => {
  const [expanded, setExpanded] = useState(false);
  const [isCopied, copyText] = useCopyClipboard();

  return (
    <div
      className={clsx(styles.fullselect, { [styles.expanded]: expanded })}
      onClick={() => setExpanded(!expanded)}
    >
      <span className={styles.selected}>
        <Tooltip
          title={isCopied ? 'Copied' : 'Copy Address '}
          placement="bottom"
          arrow
        >
          <IconButton
            className={styles.copyIcon}
            onClick={(e) => {
              e.stopPropagation();
              copyText(tokenAddress);
            }}
          >
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          className={styles.linkIcon}
          onClick={(e) => {
            e.stopPropagation();
            window.open(addressUrl, '_blank');
          }}
        >
          <LinkIcon />
        </IconButton>
        <span>
          <Avatar address={tokenAddress} />
          <div className={styles.address}>
            {tokenName}
            <small>{ellipsis(tokenAddress)}</small>
          </div>
        </span>
        <DownArrowIcon className={styles.arrow} />
      </span>
      <ul className={styles.options}>
        {assetList.length > 0 &&
          assetList.map((asset: IAssetInfoState) => {
            return (
              <AssetItem
                asset={asset}
                key={asset.id}
                itemClicked={() => onChange(asset)}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default AssetSelect;
