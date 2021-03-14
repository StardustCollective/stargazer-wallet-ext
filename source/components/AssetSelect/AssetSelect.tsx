import React, { useState, FC } from 'react';
import clsx from 'clsx';
import DownArrowIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';

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
  onChange: (value: IAssetInfoState) => void;
}

const AssetSelect: FC<IAssetSelect> = ({
  assetList,
  tokenName,
  tokenAddress,
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
            className={styles.icon_wrapper}
            onClick={(e) => {
              e.stopPropagation();
              copyText(tokenAddress);
            }}
          >
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <span>
          {tokenName}
          <small>{ellipsis(tokenAddress)}</small>
        </span>
        <DownArrowIcon className={styles.arrow} />
      </span>
      <ul className={styles.options}>
        {assetList.length > 0 &&
          assetList.map((asset: IAssetInfoState) => {
            return (
              <AssetItem asset={asset} itemClicked={() => onChange(asset)} />
            );
          })}
      </ul>
    </div>
  );
};

export default AssetSelect;
