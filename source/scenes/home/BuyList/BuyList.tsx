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

const BuyList: FC<IBuyList> = ({ supportedAssets, handleSelectAsset }) => {

  const renderAssetList = () => {
    const assets = supportedAssets?.data;

    return (
      <>
        {assets ? Object.keys(assets).map((key: string) => {
          return (
            <AssetItem
              id={assets[key].id}
              key={assets[key].id}
              asset={assets[key]}
              assetInfo={assets[key]}
              itemClicked={() => handleSelectAsset(assets[key].id)}
            />
          );
        }) : <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>There was an error loading assets. Please try again later.</TextV3.Caption>}
      </>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      {supportedAssets?.loading ? <CircularProgress className={styles.loader} /> : renderAssetList()}
    </div>
  );
};

export default BuyList;
