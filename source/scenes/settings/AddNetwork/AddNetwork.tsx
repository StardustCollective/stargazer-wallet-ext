///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////



///////////////////////
// Types
///////////////////////

import IAddNetwork from './types';

///////////////////////
// Styles
///////////////////////

import styles from './AddNetwork.scss';

const AddNetwork: FC<IAddNetwork> = ({ handleSave }) => {

  ///////////////////////
  // Render
  ///////////////////////

  console.log(handleSave);

  return (
    <div className={styles.container}>
      <p>Add Network Form</p>
    </div>
  );
};

export default AddNetwork;
