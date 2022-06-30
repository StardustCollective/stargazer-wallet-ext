///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import AssetWithToggle from 'components/AssetWithToggle';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchInput from 'components/SearchInput';

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

import { COLORS_ENUMS } from 'assets/styles/colors';
const CIRCULAR_PROGRESS_SIZE = 18;

const AssetList: FC<IAssetList> = ({ assets, allAssets, loading, toggleAssetItem, searchValue, onSearch }) => {

  const renderAssetList = () => {

    return (
      <div className={styles.listContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle} dynamic>{allAssets[0].title}</TextV3.CaptionStrong>
        {
          allAssets[0].data.map((item: IAssetInfoState) => {
            const selected = !!assets[item.id];
            const disabled = ['constellation', 'ethereum'].includes(item.id);
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
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle} dynamic>{allAssets[1].title}</TextV3.CaptionStrong>
        {
          allAssets[1].data.map((item: IAssetInfoState) => {
            const selected = !!assets[item.id];
            const disabled = ['constellation', 'ethereum'].includes(item.id);
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
