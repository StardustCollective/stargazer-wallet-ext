import React from 'react';
import clsx from 'clsx';

import styles from './TextV3.scss';
import globalStyles from 'assets/styles/global.scss'
import { COLORS_ENUMS } from 'assets/styles/colors';

enum TEXT_ALIGN_ENUM {
  LEFT = 0,
  CENTER,
  RIGHT,
}

interface ITextProps {
  children?: React.ReactNode;
  textStyle?: string;
  color?: COLORS_ENUMS;
  align?: TEXT_ALIGN_ENUM;
}

const Text = {
  base: ({ 
      children, 
      color = COLORS_ENUMS.WHITE, 
      align = TEXT_ALIGN_ENUM.LEFT,
      textStyle = '' 
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
        ])}
      >
        {children}
      </span>
    )
  },
  HeaderDisplay: ({ children, color, align }: ITextProps) => {
    return (
      <Text.base
        color={color}
        textStyle={styles.headerDisplay}
        align={align}
      >
        {children}
      </Text.base>
    )
  },
  HeaderLarge: ({ children, color, align }: ITextProps) => {
    return (
      <Text.base
        color={color}
        textStyle={styles.headerLarge}
        align={align}
      >
        {children}
      </Text.base>
    )
  },
  BodyStrong: ({ children, color, align }: ITextProps) => {
    return (
      <Text.base
        color={color}
        textStyle={styles.bodyStrong}
        align={align}
      >
        {children}
      </Text.base>
    )
  }
}

export default Text;