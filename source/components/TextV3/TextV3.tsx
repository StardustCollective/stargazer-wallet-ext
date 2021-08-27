
//////////////////////
// Modules
///////////////////// 

import React from 'react';
import clsx from 'clsx';

//////////////////////
// Styles
///////////////////// 

import styles from './TextV3.scss';
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
// Interface
///////////////////// 
interface ITextProps {
  children?: React.ReactNode;
  textStyle?: string;
  extraStyles?: string;
  color?: COLORS_ENUMS;
  align?: TEXT_ALIGN_ENUM;
}

//////////////////////
// Components
///////////////////// 

const TextV3 = {
  base: ({ 
      children, 
      color = COLORS_ENUMS.WHITE, 
      align = TEXT_ALIGN_ENUM.LEFT,
      textStyle = '' ,
      extraStyles = ''
  }: ITextProps) => {

    let colorStyle = ''; 
    let alignStyle = ''; 

    // Colors
    if (color === COLORS_ENUMS.BLACK) {
      colorStyle = 't-black';
    }else if(color === COLORS_ENUMS.WHITE){
      colorStyle = 't-white';
    }

    //Alignment
    if(align === TEXT_ALIGN_ENUM.LEFT){
      alignStyle = 't-alignLeft';
    }else if(align === TEXT_ALIGN_ENUM.CENTER){
      alignStyle = 't-alignCenter';
    }else if(align === TEXT_ALIGN_ENUM.RIGHT){
      alignStyle = 't-alignRight';
    }

    return (
      <span className={clsx([
        styles.base,
        colorStyle, 
        alignStyle,
        textStyle, 
        extraStyles,
        ])}
      >
        {children}
      </span>
    )
  },
  HeaderDisplay: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        color={color}
        textStyle={styles.headerDisplay}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  HeaderLarge: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        color={color}
        textStyle={styles.headerLarge}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  Body: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        color={color}
        textStyle={styles.body}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  BodyStrong: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        color={color}
        textStyle={styles.bodyStrong}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  Caption: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        color={color}
        textStyle={styles.caption}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    )
  },
  CaptionStrong: ({ children, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
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