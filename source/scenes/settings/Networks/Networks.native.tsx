///////////////////////
// Modules
///////////////////////

import React, { FC, useState } from 'react';
import { View } from 'react-native';

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

import styles from './styles';

const NetworksComponent: FC<INetworkSettings> = ({ networkOptions }) => {
  // Logic used to not have multiple dropdowns open at the same time
  const initialArray = Array.from({ length: networkOptions.length }, () => false);
  const [itemsOpenArray, setItemsOpenArray] = useState(initialArray)

  const toggleItem = (i) => {
    const value = itemsOpenArray[i];
    let newItemsOpenArray = initialArray;
    newItemsOpenArray[i] = !value;
    setItemsOpenArray(newItemsOpenArray);
  }

  return (
    <View style={styles.wrapper}>
      {networkOptions.map((options, i) => {
        return (
          <View key={options.key} style={[styles.containerBase, options.containerStyle]}>
            <Dropdown 
              options={{
                ...options, 
                isOpen: itemsOpenArray[i], 
                toggleItem: () => toggleItem(i) 
              }} 
            />
          </View>
        );
      })}
    </View>
  );
};

export default NetworksComponent;
