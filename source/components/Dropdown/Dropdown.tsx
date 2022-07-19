///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Types
///////////////////////

import IDropdown from './types';

///////////////////////
// Styles
///////////////////////

import styles from './Dropdown.scss';

const Dropdown: FC<IDropdown> = ({ label, data, onSelect }): JSX.Element => {

  ///////////////////////
  // Render
  ///////////////////////

  console.log({ data, label, onSelect });

  return (
    <div className={styles.container}>
      <p>Dropdown</p>
    </div>
  );
};

export default Dropdown;
