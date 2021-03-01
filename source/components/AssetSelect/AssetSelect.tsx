import React, { useState, FC } from 'react';
import clsx from 'clsx';
import DownArrowIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AssetItem from 'components/AssetItem';
import { Asset } from 'types/asset';
import styles from './AssetSelect.scss';

interface IAssetSelect {
  assetList: Array<Asset>;
  onChange: (value: Asset) => void;
}

const AssetSelect: FC<IAssetSelect> = ({ assetList, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  console.log('asset list', assetList);
  return (
    <div
      className={clsx(styles.fullselect, { [styles.expanded]: expanded })}
      onClick={() => setExpanded(!expanded)}
    >
      <span className={styles.selected}>
        <FileCopyIcon className={styles.file_copy} />
        {/* // TODO: Changed in the future, using dummy data for now */}
        DAG
        <DownArrowIcon className={styles.arrow} />
      </span>
      <ul className={styles.options}>
        {assetList.length > 0 &&
          assetList.map((asset: Asset) => {
            return (
              <AssetItem asset={asset} itemClicked={() => onChange(asset)} />
            );
          })}
      </ul>
    </div>
  );
};

export default AssetSelect;
