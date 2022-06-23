///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import TextV3 from 'components/TextV3';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './AssetList.scss';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';

const AssetList: FC<IAssetList> = ({ constellationAssets, erc20Assets }) => {

  const renderAssetList = () => {

    return (
      <>
        {constellationAssets ? constellationAssets.map((key: string) => {
          return (
           <div key={key}>Asset Item</div>
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
      {false ? <div className={styles.loaderContainer}><CircularProgress size={18} /></div> : renderAssetList()}
    </div>
  );
};

export default AssetList;
