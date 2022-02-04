import React, { FC } from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';

import { Icon as RNEIcon, Image } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

import styles from './styles';

interface IIcon {
  Component: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | string;
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

  const composedIconStyles = StyleSheet.flatten([styles.icon, iconStyles, width ? { width } : {}]);

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
    <Component style={composedIconStyles} />;
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
