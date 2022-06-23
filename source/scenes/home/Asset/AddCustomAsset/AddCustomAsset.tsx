///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Types
///////////////////////////

import IAddCustomAsset from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './Asset.scss';

const AddCustomAsset: FC<IAddCustomAsset> = () => {

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <p>Add Custom Asset</p>
    </div>
  );
};

export default AddCustomAsset;
