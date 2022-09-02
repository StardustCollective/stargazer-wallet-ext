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
import { getNetworkFromChainId, getNetworkLabel } from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './AssetList.scss';
import { ActiveNetwork, AssetSymbol } from 'state/vault/types';

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
            const disabled = [AssetSymbol.DAG, AssetSymbol.ETH].includes(item?.symbol as AssetSymbol);
            const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
            const itemChainId = item?.network;
            const itemNetwork = getNetworkFromChainId(itemChainId);
            const currentActiveNetwork = activeNetwork[itemNetwork as keyof ActiveNetwork];
            const network = getNetworkLabel(currentActiveNetwork, item?.symbol);
            // TODO-349: Only Polygon. Add isAVAX and isBNB
            const isMATIC = item?.symbol === AssetSymbol.MATIC && itemChainId === 'matic';
            const hideToken = itemChainId !== 'both' && !isMATIC && currentActiveNetwork !== itemChainId;
            if (!isAssetSupported || hideToken) return null;
            return <AssetWithToggle 
                      id={item?.id}
                      symbol={item?.symbol} 
                      network={network}
                      logo={item?.logo} 
                      label={item?.label} 
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
