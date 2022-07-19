///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down.svg';
import CheckIcon from 'assets/images/svg/check-transparent.svg';

///////////////////////
// Types
///////////////////////

import IDropdown from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const Dropdown: FC<IDropdown> = ({ options }): JSX.Element => {
  const { icon, title, value, items, isOpen, toggleItem, onChange } = options;

  const selectedValue = items.find(item => item.value === value);

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <TouchableOpacity onPress={toggleItem} style={styles.container}>
      {!!icon && 
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={{ uri: icon }}/>
        </View>
      }
      <View style={styles.titleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{title}</TextV3.CaptionStrong>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{selectedValue?.label}</TextV3.Caption>
      </View>
      <View>
        {isOpen ? (
          <ArrowUpIcon width={16} />
          ) : (
          <ArrowDownIcon width={16} />
        )}
      </View>
      {isOpen && (
        <View style={styles.listContainer}>
          {!!items && items.map((item) => {
            const selected = item.value === value;
            const selectedStyle = selected ? styles.selectedItem : {};
            const TextComponent = selected ? TextV3.CaptionStrong : TextV3.Caption;
            return (
              <TouchableOpacity style={[styles.itemContainer, selectedStyle]} onPress={() => onChange(item.value)}>
                <TextComponent color={COLORS_ENUMS.BLACK}>
                  {item.label}  
                </TextComponent>
                {!!selected && <CheckIcon height={16} width={16} />}
              </TouchableOpacity>
            )})
          }
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Dropdown;
