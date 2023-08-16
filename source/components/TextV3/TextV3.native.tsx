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
  numberOfLines?: number;
};

//////////////////////
// Components
/////////////////////

const COLOR_STYLES: { [value: number]: object } = {
  [COLORS_ENUMS.BLACK]: styles.blackFont,
  [COLORS_ENUMS.WHITE]: styles.whiteFont,
  [COLORS_ENUMS.GRAY_100]: styles.gray100Font,
  [COLORS_ENUMS.DARK_GRAY_200]: styles.greyDark200Font,
  [COLORS_ENUMS.PRIMARY]: styles.primary,
  [COLORS_ENUMS.DARK_GRAY]: styles.grayDarkFont,
  [COLORS_ENUMS.PRIMARY_LIGHTER_1]: styles.primaryLighter1,
  [COLORS_ENUMS.RED]: styles.redFont,
  [COLORS_ENUMS.PURPLE_DARK]: styles.purpleDarkFont,
  [COLORS_ENUMS.LINK_BLUE]: styles.linkBlueFont,
  [COLORS_ENUMS.SECONDARY_TEXT]: styles.secondaryTextFont,
};

const ALIGN_STYLES: { [value: number]: object } = {
  [TEXT_ALIGN_ENUM.LEFT]: styles.alignLeft,
  [TEXT_ALIGN_ENUM.CENTER]: styles.alignCenter,
  [TEXT_ALIGN_ENUM.RIGHT]: styles.alignRight,
};

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
    numberOfLines,
  }: ITextProps) => {
    let colorStyle = COLOR_STYLES[color];
    let alignStyle = ALIGN_STYLES[align];

    let dynamicProps: { numberOfLines: number | null; adjustsFontSizeToFit: boolean } = {
      numberOfLines: null,
      adjustsFontSizeToFit: false,
    };

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
      <Text
        style={composedStyle}
        numberOfLines={dynamicProps.numberOfLines || numberOfLines}
        adjustsFontSizeToFit={dynamicProps.adjustsFontSizeToFit}
        selectable={selectable}
      >
        {children}
      </Text>
    );
  },
  HeaderDisplay: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  HeaderLarge: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  HeaderLargeRegular: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  Header: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  Body: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  BodyStrong: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  LabelSemiStrong: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.labelSemiStrong}
        align={align}
        extraStyles={extraStyles}
        uppercase={uppercase}
        selectable={selectable}
        margin={margin}
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  Caption: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  CaptionRegular: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  CaptionStrong: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  Label: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
  Description: ({
    children,
    dynamic,
    color,
    align,
    extraStyles,
    uppercase,
    selectable,
    margin,
    numberOfLines,
  }: ITextProps) => {
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
        numberOfLines={numberOfLines}
      >
        {children}
      </TextV3.base>
    );
  },
};

export default TextV3;
