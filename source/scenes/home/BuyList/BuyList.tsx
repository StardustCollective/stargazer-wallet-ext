///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import AssetItem from 'components/AssetItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextV3 from 'components/TextV3';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './BuyList.scss';

///////////////////////////
// Types
///////////////////////////

import { IBuyList } from './types';
import { IAssetInfoState } from 'state/assets/types';

const BuyList: FC<IBuyList> = ({ assets, loading, handleSelectAsset }) => {
  const renderAssetList = () => {
    return (
      <>
        {assets ? (
          assets.map((asset: IAssetInfoState) => {
            return (
              <AssetItem
                id={asset.id}
                key={asset.id}
                asset={asset}
                assetInfo={asset}
                itemClicked={() => handleSelectAsset(asset)}
              />
            );
          })
        ) : (
          <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
            There was an error loading assets. Please try again later.
          </TextV3.Caption>
        )}
      </>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <CircularProgress size={18} />
        </div>
      ) : (
        renderAssetList()
      )}
    </div>
  );
};

export default BuyList;
