//////////////////////
// Modules
/////////////////////

import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

//////////////////////
// Styles
/////////////////////

import styles from './styles';

//////////////////////
// Enums
/////////////////////

export enum BUTTON_TYPES_ENUM {
  PRIMARY_SOLID = 0,
  ACCENT_ONE_SOLID,
  MONOTONE_ONE_SOLID,
  PRIMARY_OUTLINE,
  ACCENT_ONE_OUTLINE,
}

export enum BUTTON_SIZES_ENUM {
  SMALL = 0,
  LARGE,
}

//////////////////////
// Interfaces
/////////////////////

interface IButtonV3Props {
  id?: string;
  type?: BUTTON_TYPES_ENUM;
  size?: BUTTON_SIZES_ENUM;
  title: string;
  extraStyle?: string;
  onPress?: () => void;
}

//////////////////////
// Component
/////////////////////

const ButtonV3: FC<IButtonV3Props> = ({
  id,
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  title = '',
  extraStyle = '',
  onPress = () => {},
}) => {
  let buttonSizeStyle = {};
  let buttonColorStyle = {};
  let buttonTextColor = null;
  let buttonBorderStyle = '';
  let titleStyle = {};

  if (size === BUTTON_SIZES_ENUM.SMALL) {
    buttonSizeStyle = styles.buttonSmall;
    titleStyle = styles.titleSmall;
  } else if (size === BUTTON_SIZES_ENUM.LARGE) {
    buttonSizeStyle = styles.buttonLarge;
    titleStyle = styles.titleLarge;
  }

  if (type === BUTTON_TYPES_ENUM.PRIMARY_SOLID) {
    buttonColorStyle = styles.primaryButton;
  } else if (type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID) {
    buttonColorStyle = styles.accentOneButton;
  }

  const flatButtonStyles = StyleSheet.flatten([styles.base, buttonSizeStyle, buttonColorStyle]);

  const composedButtonStyles = StyleSheet.compose(flatButtonStyles, extraStyle);

  return (
    <Button testID={id} title={title} buttonStyle={composedButtonStyles} titleStyle={titleStyle} onPress={onPress} />
  );
};

export default ButtonV3;
