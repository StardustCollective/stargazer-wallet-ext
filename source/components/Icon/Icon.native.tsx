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
}

const IconComponent: FC<IIcon> = ({
  Component,
  spaced = true,
  variant,
  width = 24,
  iconStyles,
}) => {
    let spacedStyle;
    if(spaced === true) {
        spacedStyle = styles.iconSpaced;
    } else {
        spacedStyle = null;
    }

    // const componentStyles = StyleSheet.flatten([
    //     styles.icon,
    //     spacedStyle,
    //     // variant,
    //     // iconStyles,
    // ]);

    // const _Component = typeof Component === 'string' ? (
    //     <Image source={{ uri: `/${Component}`, width: width }} />
    //   ) : (
    //     <Component styles={{ width }} />
    //   );

    return (
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 5,
          flexGrow: 1,
        }}
      >
        <Icon
          type="EvilIcons"
          name='search' />

        <Icon
          name='g-translate'
          color='#00aced' />

        <Icon
          name='sc-telegram'
          type='evilicon'
          color='#517fa4'
        />

        <Icon
          reverse
          name='ios-american-football'
          type='ionicon'
          color='#517fa4'
        />

        <Icon
          raised
          name='heartbeat'
          type='font-awesome'
          color='#f50'
          onPress={() => console.log('hello')} />
      </View>
    );
  // return (
  //   <Icon 
  //       containerStyle={componentStyles}
  //       Component={_Component}/>
  // );
};

export default IconComponent;
