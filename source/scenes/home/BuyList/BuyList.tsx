///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import AssetsPanel from 'scenes/home/Home/AssetsPanel';

///////////////////////////
// Styles
///////////////////////////

import styles from './BuyList.scss';

const BuyList: FC = () => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <AssetsPanel showNFTs={false} />
    </div>
  );
};

export default BuyList;
