//////////////////////
// Modules
/////////////////////

import React from 'react';
import { Text, TextStyle, StyleProp, StyleSheet } from 'react-native';

//////////////////////
// Styles
/////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

//////////////////////
// Enums
/////////////////////

export enum TEXT_ALIGN_ENUM {
  LEFT = 0,
  CENTER,
  RIGHT,
}

//////////////////////
// Types
/////////////////////

type ITextProps = {
  children?: React.ReactNode;
  dynamic?: boolean;
  textStyle?: StyleProp<TextStyle>;
  extraStyles?: StyleProp<TextStyle>;
  color?: COLORS_ENUMS;
  align?: TEXT_ALIGN_ENUM;
  uppercase?: boolean;
  selectable?: boolean;
  margin?: boolean;
};

//////////////////////
// Components
/////////////////////

const TextV3 = {
  base: ({
    children,
    dynamic = false,
    color = COLORS_ENUMS.WHITE,
    align = TEXT_ALIGN_ENUM.LEFT,
    uppercase = false,
    selectable = false,
    textStyle,
    extraStyles = {},
    margin = true,
  }: ITextProps) => {
    let colorStyle = {};
    let alignStyle = {};
    let dynamicProps = { numberOfLines: null, adjustsFontSizeToFit: false };

    // // Colors
    if (color === COLORS_ENUMS.BLACK) {
      colorStyle = styles.blackFont;
    } else if (color === COLORS_ENUMS.WHITE) {
      colorStyle = styles.whiteFont;
    } else if (color === COLORS_ENUMS.RED) {
      colorStyle = styles.redFont;
    } else if (color === COLORS_ENUMS.DARK_GRAY) {
      colorStyle = styles.greyDarkFont;
    } else if (color === COLORS_ENUMS.GRAY_100) {
      colorStyle = styles.gray100Font;
    }else if (color === COLORS_ENUMS.PRIMARY) {
      colorStyle = styles.primary;
    }

    //Alignment
    if (align === TEXT_ALIGN_ENUM.LEFT) {
      alignStyle = styles.alignLeft;
    } else if (align === TEXT_ALIGN_ENUM.CENTER) {
      alignStyle = styles.alignCenter;
    } else if (align === TEXT_ALIGN_ENUM.RIGHT) {
      alignStyle = styles.alignRight;
    }

    const flatStyles = StyleSheet.flatten([
      styles.base,
      textStyle,
      alignStyle,
      colorStyle,
      uppercase && styles.uppercase,
      !margin && styles.noMargin,
    ]);

    const composedStyle = StyleSheet.compose(flatStyles, extraStyles);

    if (dynamic) {
      dynamicProps.numberOfLines = 1;
      dynamicProps.adjustsFontSizeToFit = true;
    }

    return (
      <Text style={composedStyle} {...dynamicProps} selectable={selectable}>
        {children}
      </Text>
    );
  },
  HeaderDisplay: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerDisplay}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  HeaderLarge: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerLarge}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  HeaderLargeRegular: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerLargeRegular}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  Header: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.header}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  Body: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.body}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  BodyStrong: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.bodyStrong}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  Caption: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.caption}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  CaptionRegular: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.captionRegular}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  CaptionStrong: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.captionStrong}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  Label: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.label}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
  Description: ({ children, dynamic, color, align, extraStyles, uppercase, selectable, margin }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.description}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
      >
        {children}
      </TextV3.base>
    );
  },
};

export default TextV3;
