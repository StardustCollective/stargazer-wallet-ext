///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down.svg';

///////////////////////
// Types
///////////////////////

import INetworkPicker from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const ICON_WIDTH = 12;
const ICON_HEIGHT = 6;

const NetworkPicker: FC<INetworkPicker> = ({ title, isOpen, onPress, icon = null }): JSX.Element => {
  const logoExtraStyle = icon?.includes('constellation') ? styles.constellationLogo : {};
  const iconStyle = StyleSheet.flatten([
    styles.icon,
    logoExtraStyle
  ]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {!!icon && 
        <View style={styles.iconContainer}>
          <Image style={iconStyle} source={{ uri: icon }}/>
        </View>
      }
      <View style={styles.titleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE}>{title}</TextV3.CaptionStrong>
      </View>
      <View>
        {isOpen ? (
          <ArrowUpIcon width={ICON_WIDTH} height={ICON_HEIGHT} color="white"  />
          ) : (
          <ArrowDownIcon width={ICON_WIDTH} height={ICON_HEIGHT} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NetworkPicker;