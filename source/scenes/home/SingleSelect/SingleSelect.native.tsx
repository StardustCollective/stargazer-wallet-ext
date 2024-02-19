///////////////////////////
// Imports
///////////////////////////

import React, { FC, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'assets/images/svg/check-primary.svg';

///////////////////////////
// Type
///////////////////////////

import { ISingleSelect } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const SingleSelect: FC<ISingleSelect> = ({ data, selected, onSelect }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const [localSelected, setLocalSelected] = useState(selected);

  const changeSelectedValue = (value: string) => {
    setLocalSelected(value);
    onSelect(value);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  const renderItem = (item) => {
    const isSelected = item.value === localSelected;
    const selectedStyle = !!isSelected ? styles.selectedBorder : {};
    return (
      <TouchableOpacity
        onPress={() => changeSelectedValue(item.value)}
        style={[styles.itemContainer, selectedStyle]}
      >
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={{ uri: item.icon }} />
        </View>
        <View style={styles.titleContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {item.label}
          </TextV3.CaptionStrong>
        </View>
        {!!isSelected && <CheckIcon width={16} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>{!!data && data.map((item) => renderItem(item))}</View>
  );
};

export default SingleSelect;
