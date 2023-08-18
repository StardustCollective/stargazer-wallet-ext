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

const ICON_SIZE = 16;

const Dropdown: FC<IDropdown> = ({ options }): JSX.Element => {
  const {
    icon,
    title,
    value,
    items,
    isOpen,
    toggleItem,
    onChange,
    disabled = false,
    showArrow = true,
    displayValue = false,
  } = options;

  const selectedValue = items.find((item) => item.value === value);
  const TextComponent = !!title ? TextV3.Caption : TextV3.CaptionStrong;
  const TextColor = !!title ? COLORS_ENUMS.GRAY_100 : COLORS_ENUMS.BLACK;

  const ArrowIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;
  const subtitle = displayValue ? selectedValue?.value : selectedValue?.label;

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <TouchableOpacity disabled={disabled} onPress={toggleItem} style={styles.container}>
      {!!icon && (
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={{ uri: icon }} />
        </View>
      )}
      <View style={styles.titleContainer}>
        {!!title && (
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{title}</TextV3.CaptionStrong>
        )}
        <TextComponent color={TextColor}>{subtitle}</TextComponent>
      </View>
      <View>{!!showArrow && <ArrowIcon width={ICON_SIZE} color="#6B7280" />}</View>
      {isOpen && (
        <View style={styles.listContainer}>
          {!!items &&
            items.map((item) => {
              const selected = item.value === value;
              const selectedStyle = selected ? styles.selectedItem : {};
              const TextComponent = selected
                ? TextV3.CaptionStrong
                : TextV3.CaptionRegular;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.itemContainer, selectedStyle]}
                  onPress={() => onChange(item.value)}
                >
                  <TextComponent color={COLORS_ENUMS.BLACK}>{item.label}</TextComponent>
                  {!!selected && <CheckIcon height={ICON_SIZE} width={ICON_SIZE} />}
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Dropdown;
