///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

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
import {
  getNetworkFromChainId,
  getNetworkLabel,
  getNetworkLogo,
} from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';
import { ActiveNetwork, AssetType } from 'state/vault/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './AssetList.scss';
import { CONSTELLATION_LOGO } from 'constants/index';

///////////////////////////
// Constants
///////////////////////////

const CIRCULAR_PROGRESS_SIZE = 18;

const AssetList: FC<IAssetList> = ({
  assets,
  allAssets,
  loading,
  toggleAssetItem,
  searchValue,
  onSearch,
  activeWallet,
  activeNetwork,
}) => {
  const renderAssetList = () => {
    return (
      <div className={styles.listContainer}>
        {allAssets.map((item: IAssetInfoState) => {
          const selected = !!assets[item?.id];
          const itemType = getKeyringAssetType(item?.type);
          const disabled = [AssetType.Constellation, AssetType.Ethereum].includes(
            item?.id as AssetType
          );
          const isAssetSupported = activeWallet?.supportedAssets?.includes(itemType);
          const itemChainId = item?.network;
          const itemNetwork =
            item?.type === AssetType.Constellation
              ? KeyringNetwork.Constellation
              : getNetworkFromChainId(itemChainId);
          const currentActiveNetwork = activeNetwork[itemNetwork as keyof ActiveNetwork];
          const networkLabel = getNetworkLabel(currentActiveNetwork);
          const networkLogo =
            item?.type === AssetType.Constellation
              ? CONSTELLATION_LOGO
              : getNetworkLogo(itemChainId);
          // 349: New network should be added here.
          const isMATIC = item?.id === AssetType.Polygon && itemChainId === 'matic';
          const isAVAX =
            item?.id === AssetType.Avalanche && itemChainId === 'avalanche-mainnet';
          const isBNB = item?.id === AssetType.BSC && itemChainId === 'bsc';
          const isBase = item?.id === AssetType.Base && itemChainId === 'base-mainnet';
          const hideToken =
            itemChainId !== 'both' &&
            !isMATIC &&
            !isAVAX &&
            !isBNB &&
            !isBase &&
            currentActiveNetwork !== itemChainId;
          if (!isAssetSupported || hideToken) {
            return null;
          }
          return (
            <AssetWithToggle
              key={item?.id}
              id={item?.id}
              symbol={item?.symbol}
              networkLogo={networkLogo}
              networkLabel={networkLabel}
              logo={item?.logo}
              label={item?.label}
              selected={selected}
              disabled={disabled}
              toggleItem={(value) => toggleAssetItem(item, value)}
            />
          );
        })}
      </div>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchInput
          value={searchValue}
          onChange={onSearch}
          extraStyles={styles.searchInput}
        />
      </div>
      {loading ? (
        <div className={styles.progressContainer}>
          <CircularProgress size={CIRCULAR_PROGRESS_SIZE} />
        </div>
      ) : (
        <div className={styles.assetList}>{renderAssetList()}</div>
      )}
    </div>
  );
};

export default AssetList;
