///////////////////////
// Modules
///////////////////////

import React, { FC, useState } from 'react';

///////////////////////
// Components
///////////////////////

import Dropdown from 'components/Dropdown';

///////////////////////
// Types
///////////////////////

import INetworkSettings from './types';

///////////////////////
// Styles
///////////////////////

import styles from './Networks.scss';

const Networks: FC<INetworkSettings> = ({ networkOptions }) => {
  // Logic used to not have multiple dropdowns open at the same time
  const initialArray = Array.from({ length: networkOptions.length }, () => false);
  const [itemsOpenArray, setItemsOpenArray] = useState(initialArray)

  const toggleItem = (i: number) => {
    const value = itemsOpenArray[i];
    let newItemsOpenArray = initialArray;
    newItemsOpenArray[i] = !value;
    setItemsOpenArray(newItemsOpenArray);
  }

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <div className={styles.wrapper}>
      {networkOptions.map((options, i) => {
        return (
          <div key={options.key} className={styles.containerBase}>
            <Dropdown 
              options={{
                ...options, 
                isOpen: itemsOpenArray[i], 
                toggleItem: () => toggleItem(i) 
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default Networks;
