
//////////////////////
// Modules
///////////////////// 

import React from 'react';
import { 
  Text, 
  TextStyle, 
  StyleProp, 
  StyleSheet 
} from 'react-native';

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
}

//////////////////////
// Components
///////////////////// 

const TextV3 = {
  base: ({
    children,
    dynamic = false,
    color = COLORS_ENUMS.WHITE,
    align = TEXT_ALIGN_ENUM.LEFT,
    textStyle,
    extraStyles = {}
  }: ITextProps) => {

    let colorStyle   = {};
    let alignStyle   = {};
    let dynamicProps = {numberOfLines: null, adjustsFontSizeToFit: false};

    // // Colors
    if (color === COLORS_ENUMS.BLACK) {
      colorStyle = styles.blackFont;
    } else if (color === COLORS_ENUMS.WHITE) {
      colorStyle = styles.whiteFont;
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
    ]);

    const composedStyle = StyleSheet.compose(flatStyles, extraStyles);

    if(dynamic){
      dynamicProps.numberOfLines = 1;
      dynamicProps.adjustsFontSizeToFit = true;
    }


    return (
      <Text style={composedStyle} {...dynamicProps}>
        {children}
      </Text>
    )
  },
  HeaderDisplay: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerDisplay}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  HeaderLarge: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerLarge}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  Header: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.header}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  Body: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.body}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  BodyStrong: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.bodyStrong}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  Caption: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.caption}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  CaptionStrong: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.captionStrong}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  }
}

export default TextV3;