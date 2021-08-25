
//////////////////////
// Modules
///////////////////// 

import React, { FC } from 'react';
import clsx from 'clsx';

//////////////////////
// Components
/////////////////////

import TextV3 from 'components/TextV3';


//////////////////////
// Styles
///////////////////// 

import styles from './ButtonV3.scss';

//////////////////////
// Enums
///////////////////// 

import { COLORS_ENUMS } from 'assets/styles/colors';

export enum BUTTON_TYPES_ENUM {
  PRIMARY_SOLID = 0,
  ACCENT_ONE_SOLID,
  MONOTONE_ONE_SOLID,
  PRIMARY_OUTLINE,
  ACCENT_ONE_OUTLINE,
}

export enum  BUTTON_SIZES_ENUM {
  SMALL = 0,
  LARGE,
}

//////////////////////
// Interfaces
///////////////////// 

interface IButtonV3Props {
  type?: BUTTON_TYPES_ENUM;
  size?: BUTTON_SIZES_ENUM;
  label: string;
}

//////////////////////
// Component
///////////////////// 

const ButtonV3: FC<IButtonV3Props> = ({ 
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  label = "",
}) => {

  let buttonSizeStyle   = '';
  let buttonColorStyle  = '';
  let buttonTextColor   = null;
  let buttonBorderStyle = '';
  let TextComponent     = null;

  if(size === BUTTON_SIZES_ENUM.SMALL){
    buttonSizeStyle = styles.buttonSmall;
    TextComponent   = TextV3.CaptionStrong
  }else if(size === BUTTON_SIZES_ENUM.LARGE){
    buttonSizeStyle = styles.buttonLarge;
    TextComponent   = TextV3.BodyStrong
  }

  if(type === BUTTON_TYPES_ENUM.PRIMARY_SOLID){
    buttonColorStyle = 'b-primary';
    buttonTextColor  = COLORS_ENUMS.WHITE;
  }else if(type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID){
    buttonColorStyle = '.b-accentOne';
    buttonTextColor  = COLORS_ENUMS.WHITE;
  }

  return (
    <div className={clsx([
      buttonColorStyle,
      buttonTextColor,
      buttonSizeStyle,
      buttonBorderStyle
    ])}>
      <TextComponent>
        {label}
      </TextComponent>
    </div>
  );

}

export default ButtonV3;