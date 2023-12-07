import React, { FC } from 'react';

import { Icon as RNEIcon, Image } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

import styles from './styles';

interface IIcon {
  Component: React.ReactNode | string;
  name: string;
  fontType: string;
  iconStyles: object;
  iconContainerStyles: object;
  spaced: boolean;
  width: number;
  // backgroundColor?: string;
  // color?: string;
  // size?: number;
  // solid?: boolean;
}

const IconComponent: FC<IIcon> = ({
  Component,
  spaced = true,
  width,
  iconStyles = {},
  iconContainerStyles = {},
  name,
  fontType,
  ...otherProps
}) => {
  const composedContainerStyles = StyleSheet.flatten([
    styles.iconWrapper,
    iconContainerStyles,
    spaced ? styles.spaced : {},
  ]);

  const composedIconStyles = StyleSheet.flatten([
    styles.icon,
    iconStyles,
    width ? { width } : {},
  ]);

  if (typeof Component === 'string') {
    return (
      <View>
        <Image
          source={{ uri: `/${Component}`, width }}
          containerStyle={composedContainerStyles}
          style={composedIconStyles}
          width={width}
        />
      </View>
    );
  }

  if (Component) {
    const IconComponent = Component;
    // this doesn't seem to work
    <View style={composedContainerStyles}>
      <IconComponent iconStyles={composedIconStyles} />
    </View>;
  }

  return (
    <RNEIcon
      containerStyle={composedContainerStyles}
      iconStyle={composedIconStyles}
      type={fontType}
      name={name}
      {...otherProps}
    />
  );
};

export default IconComponent;
