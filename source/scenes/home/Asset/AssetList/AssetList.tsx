///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import AssetWithToggle from 'components/AssetWithToggle';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchInput from 'components/SearchInput';

///////////////////////////
// Utils
///////////////////////////

import { getKeyringAssetType } from 'utils/keyringUtil';
import { getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './AssetList.scss';

///////////////////////////
// Constants
///////////////////////////

const CIRCULAR_PROGRESS_SIZE = 18;

const AssetList: FC<IAssetList> = ({ assets, allAssets, loading, toggleAssetItem, searchValue, onSearch, activeWallet, activeNetwork }) => {

  const renderAssetList = () => {

    return (
      <div className={styles.listContainer}>
        {
          allAssets.map((item: IAssetInfoState) => {
            const selected = !!assets[item?.id];
            const itemType = getKeyringAssetType(item?.type);
            const disabled = ['DAG', 'ETH'].includes(item?.symbol);
            const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
            const itemChainId = item?.network;
            const itemNetwork = getNetworkFromChainId(itemChainId);
            const differentNetwork = !['both', 'matic', 'bsc'].includes(itemChainId) && activeNetwork[itemNetwork] !== itemChainId;
            if (!isAssetSupported || differentNetwork) return null;
            return <AssetWithToggle 
                      id={item.id}
                      symbol={item.symbol} 
                      logo={item.logo} 
                      label={item.label} 
                      selected={selected} 
                      disabled={disabled}
                      toggleItem={(value) => toggleAssetItem(item, value)} />;
          })
        }
      </div>);
  }

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchInput value={searchValue} onChange={onSearch} />
      </div>
      {
        loading ? 
        <div className={styles.progressContainer}><CircularProgress size={CIRCULAR_PROGRESS_SIZE} /></div> : 
        <div className={styles.assetList}>{renderAssetList()}</div>
      }
    </div>
  );
};

export default AssetList;
