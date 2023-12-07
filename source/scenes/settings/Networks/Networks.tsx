///////////////////////
// Modules
///////////////////////

import React, { FC, useState } from 'react';

///////////////////////
// Components
///////////////////////

import Dropdown from 'components/Dropdown';
// import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';

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
  // 349: New network should be added here.
  const [itemsOpenArray, setItemsOpenArray] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleItem = (i: number) => {
    const value = itemsOpenArray[i];
    let newItemsOpenArray = [false, false, false, false, false];
    newItemsOpenArray[i] = !value;
    setItemsOpenArray(newItemsOpenArray);
  };

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
                toggleItem: () => toggleItem(i),
              }}
            />
          </div>
        );
      })}
      {/* TODO-349: Add Custom Networks in the future.
        <div className={styles.buttonContainer}>
          <ButtonV3 
            label="Add Network"
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            onClick={handleAddNetwork}
            extraStyle={styles.addNetwork}
          />
        </div> 
      */}
    </div>
  );
};

export default Networks;
