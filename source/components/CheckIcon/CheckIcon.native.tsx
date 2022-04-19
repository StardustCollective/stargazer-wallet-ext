///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { Icon } from 'react-native-elements';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

const ICON_NAME_STRING = 'check';
const ICON_TYPE_STRING = 'font-awesome';
const ICON_COLOR_STRING = 'white';
const ICON_SIZE_NUMBER = 90;

///////////////////////////
// Component
///////////////////////////

const CheckIcon: FC = () => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Icon
      name={ICON_NAME_STRING}
      type={ICON_TYPE_STRING}
      color={ICON_COLOR_STRING}
      size={ICON_SIZE_NUMBER}
      containerStyle={styles.container}
    />
  );
};

export default CheckIcon;
