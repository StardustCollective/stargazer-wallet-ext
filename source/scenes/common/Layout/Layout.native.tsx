///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';

///////////////////////////
// Types
///////////////////////////

import ILayout from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Component
///////////////////////////

const Layout: FC<ILayout> = ({ title, children }) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <View style={styles.layout}>
      <View style={styles.heading}>
        <TextV3.HeaderLargeRegular color={COLORS_ENUMS.DARK_GRAY}>
          {title}
        </TextV3.HeaderLargeRegular>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default Layout;
