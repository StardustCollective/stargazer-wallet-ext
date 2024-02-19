///////////////////////
// Modules
///////////////////////

import React, { FC, useState } from 'react';
import { View } from 'react-native';

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

import styles from './styles';

const NetworksComponent: FC<INetworkSettings> = ({ networkOptions }) => {
  // Logic used to not have multiple dropdowns open at the same time
  // 349: New network should be added here.
  const [itemsOpenArray, setItemsOpenArray] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleItem = (i) => {
    const value = itemsOpenArray[i];
    let newItemsOpenArray = [false, false, false, false, false];
    newItemsOpenArray[i] = !value;
    setItemsOpenArray(newItemsOpenArray);
  };

  return (
    <View style={styles.wrapper}>
      {networkOptions.map((options, i) => {
        return (
          <View key={options.key} style={[styles.containerBase, options.containerStyle]}>
            <Dropdown
              options={{
                ...options,
                isOpen: itemsOpenArray[i],
                toggleItem: () => toggleItem(i),
              }}
            />
          </View>
        );
      })}
      {/* TODO-349: Add Custom Networks in the future.
        <View style={styles.buttonContainer}>
          <ButtonV3 
            title="Add Network"
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            onPress={handleAddNetwork}
          />
        </View> 
      */}
    </View>
  );
};

export default NetworksComponent;
