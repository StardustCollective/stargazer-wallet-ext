import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

import styles from './styles';

interface ICircleIcon {
  logo: string | React.Component;
  label: string;
  containerStyle: object;
  iconStyle: object;
}

const CircleIcon: FC<ICircleIcon> = ({
  logo,
  label,
  containerStyle = {},
  iconStyle = {},
}) => {
  const containerComposedStyles = StyleSheet.compose(styles.logoWrapper, containerStyle);
  const iconComposedStyles = StyleSheet.compose(styles.logoIcon, iconStyle);

  if (typeof logo === 'string') {
    const uri = logo.startsWith('http') ? logo : `/${logo}`;
    return (
      <Image
        containerStyle={containerComposedStyles}
        accessible
        accessibilityLabel={label}
        source={{ uri }}
        resizeMode="contain"
      />
    );
  }

  //svg files convert to React Component
  const LogoComponent = logo;

  return (
    <View style={containerComposedStyles}>
      <LogoComponent height={32} width={32} iconStyles={iconComposedStyles} />
    </View>
  );
};

export default CircleIcon;
