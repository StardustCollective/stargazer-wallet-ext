///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';

///////////////////////
// Types
///////////////////////

import IInputClickable from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const InputClickable: FC<IInputClickable> = ({ options }): JSX.Element => {
  const { title, value, items, onClick } = options;

  const selectedItem = items.find(item => item.value === value);

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <View style={styles.container}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>{title}</TextV3.Caption>
      <TouchableOpacity onPress={onClick} style={styles.inputContainer}>
        {!!selectedItem?.icon && 
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={{ uri: selectedItem.icon }}/>
          </View>
        }
        <View style={styles.titleContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{selectedItem?.label}</TextV3.CaptionStrong>
        </View>
        <ArrowRightIcon width={16} />
      </TouchableOpacity>
    </View>
  );
};

export default InputClickable;
