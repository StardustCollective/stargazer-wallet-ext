import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import TextV3 from 'components/TextV3';
import IIconDropdown from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

const IconDropdown: FC<IIconDropdown> = ({ options }): JSX.Element => {
  const { icon, items, isOpen = false, disabled = false, onPress } = options;

  const containerSelected = isOpen && styles.containerSelected;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, containerSelected]}>{icon}</View>
      {isOpen && (
        <View style={styles.listContainer}>
          {!!items &&
            items.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemContainer}
                  onPress={item.onPressItem}
                >
                  {!!item?.icon && (
                    <View style={styles.itemIconContainer}>{item.icon}</View>
                  )}
                  <TextV3.CaptionStrong numberOfLines={1} color={COLORS_ENUMS.BLACK}>
                    {item.label}
                  </TextV3.CaptionStrong>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default IconDropdown;
