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
  SECONDARY_SOLID,
  ACCENT_ONE_SOLID,
  MONOTONE_ONE_SOLID,
  ERROR_SOLID,
  PRIMARY_OUTLINE,
  ACCENT_ONE_OUTLINE,
  SECONDARY_OUTLINE,
  TERTIARY_SOLID,
  NEW_PRIMARY_SOLID,
  GRAY_SOLID,
}

export enum BUTTON_SIZES_ENUM {
  SMALL = 0,
  MEDIUM,
  LARGE,
  FULL_WIDTH,
}

//////////////////////
// Interfaces
/////////////////////

interface IButtonV3Props {
  id?: string;
  type?: BUTTON_TYPES_ENUM;
  size?: BUTTON_SIZES_ENUM;
  title: string;
  disabled: boolean;
  loading: boolean;
  extraStyles?: {};
  extraTitleStyles?: {};
  extraContainerStyles?: {};
  onPress?: () => void;
  otherProps: any;
}

//////////////////////
// Component
/////////////////////

const ButtonV3: FC<IButtonV3Props> = ({
  id,
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  title = '',
  disabled = false,
  loading = false,
  extraStyles = {},
  extraTitleStyles = {},
  extraContainerStyles = {},
  onPress = () => {},
  ...otherProps
}) => {
  let buttonSizeStyle = {};
  let buttonColorStyle = {};
  let titleStyle = {};

  if (size === BUTTON_SIZES_ENUM.SMALL) {
    buttonSizeStyle = styles.buttonSmall;
    titleStyle = styles.titleSmall;
  } else if (size === BUTTON_SIZES_ENUM.MEDIUM) {
    buttonSizeStyle = styles.buttonMedium;
    titleStyle = styles.titleMedium;
  } else if (size === BUTTON_SIZES_ENUM.LARGE) {
    buttonSizeStyle = styles.buttonLarge;
    titleStyle = styles.titleLarge;
  } else if (size === BUTTON_SIZES_ENUM.FULL_WIDTH) {
    buttonSizeStyle = styles.buttonFullWidth;
    titleStyle = styles.titleLarge;
  }

  if (type === BUTTON_TYPES_ENUM.PRIMARY_SOLID) {
    buttonColorStyle = styles.primaryButton;
  } else if (type === BUTTON_TYPES_ENUM.PRIMARY_OUTLINE) {
    buttonColorStyle = styles.primaryOutline;
    titleStyle = { ...titleStyle, ...styles.primaryOutlineTitle };
  } else if (type === BUTTON_TYPES_ENUM.SECONDARY_SOLID) {
    buttonColorStyle = styles.secondaryButton;
  } else if (type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID) {
    buttonColorStyle = styles.accentOneButton;
  } else if (type === BUTTON_TYPES_ENUM.SECONDARY_OUTLINE) {
    buttonColorStyle = styles.secondaryOutline;
    titleStyle = { ...titleStyle, ...styles.secondaryOutlineTitle };
  } else if (type === BUTTON_TYPES_ENUM.TERTIARY_SOLID) {
    buttonColorStyle = styles.tertiarySolid;
    titleStyle = { ...titleStyle, ...styles.tertiarySolidTitle };
  } else if (type === BUTTON_TYPES_ENUM.GRAY_SOLID) {
    buttonColorStyle = styles.graySolid;
  } else if (type === BUTTON_TYPES_ENUM.ERROR_SOLID) {
    buttonColorStyle = styles.errorSolid;
  } else if (type === BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID) {
    buttonColorStyle = styles.newPrimarySolid;
  }

  const flatButtonStyles = StyleSheet.flatten([
    styles.base,
    buttonSizeStyle,
    buttonColorStyle,
  ]);

  const composedButtonStyles = StyleSheet.compose(flatButtonStyles, extraStyles);
  const composedTitleStyles = StyleSheet.compose(titleStyle, extraTitleStyles);
  const composedContainerStyles = StyleSheet.compose(
    styles.containerStyle,
    extraContainerStyles
  );
  const composedDisabledStyles = StyleSheet.compose(buttonColorStyle, styles.disabled);

  return (
    <Button
      testID={id}
      title={title}
      disabled={disabled || loading}
      disabledTitleStyle={styles.disabledTitle}
      disabledStyle={composedDisabledStyles}
      loading={loading}
      buttonStyle={composedButtonStyles}
      titleStyle={composedTitleStyles}
      containerStyle={composedContainerStyles}
      onPress={onPress}
      {...otherProps}
    />
  );
};

export default ButtonV3;
