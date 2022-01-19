import React, { FC } from 'react';
// import clsx from 'clsx';
// import { OverridableComponent } from '@material-ui/core/OverridableComponent';
// import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import { Image, Icon } from 'react-native-elements';
import { View, StyleSheet, Text } from 'react-native';

import styles from './styles';

interface IIcon {
    Component: any;
//   Component: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | string;
  iconStyles?: object;
  spaced?: boolean;
  variant?: object;
  width?: number;
  name?: string;
}

const IconComponent: FC<IIcon> = ({
  Component,
  spaced = true,
  variant,
  width = 24,
  iconStyles,
  name= '',
}) => {
    let spacedStyle;
    if(spaced === true) {
        spacedStyle = styles.iconSpaced;
    } else {
        spacedStyle = null;
    }

    const componentStyles = StyleSheet.flatten([
        styles.icon,
        spacedStyle,
        // variant,
        // iconStyles,
    ]);

    if(name) {
      return (
        <View>
          <Icon type="EvilIcons" name={name} iconStyle={componentStyles}/>
        </View>
      )
    }

    const _Component = typeof Component === 'string' ? (
        <Image source={{ uri: `/${Component}`, width: width }} />
      ) : (
        <Component styles={{ width }} />
      );

    return (
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 5,
          flexGrow: 1,
        }}>
        <Icon 
        containerStyle={componentStyles}
        Component={_Component}/>
      </View>
    );
};

export default IconComponent;
