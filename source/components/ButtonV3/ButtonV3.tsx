//////////////////////
// Modules
/////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

//////////////////////
// Components
/////////////////////

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

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
  label: string;
  extraStyle?: string;
  onClick?: () => void;
  submit?: boolean;
}

//////////////////////
// Component
/////////////////////

const ButtonV3: FC<IButtonV3Props> = ({
  id,
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  label = '',
  extraStyle = '',
  onClick = () => {},
  submit = false,
}) => {
  let buttonSizeStyle = '';
  let buttonColorStyle = '';
  let buttonTextColor = null;
  let buttonBorderStyle = '';
  let TextComponent = null;

  if (size === BUTTON_SIZES_ENUM.SMALL) {
    buttonSizeStyle = styles.buttonSmall;
    TextComponent = TextV3.CaptionStrong;
  } else if (size === BUTTON_SIZES_ENUM.LARGE) {
    buttonSizeStyle = styles.buttonLarge;
    TextComponent = TextV3.BodyStrong;
  }

  if (type === BUTTON_TYPES_ENUM.PRIMARY_SOLID) {
    buttonColorStyle = 'b-primary';
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID) {
    buttonColorStyle = 'b-accentOne';
    buttonTextColor = COLORS_ENUMS.WHITE;
  }

  return (
    <button
      id={id}
      type={submit ? 'submit' : 'button'}
      className={clsx([styles.base, buttonColorStyle, buttonTextColor, buttonSizeStyle, buttonBorderStyle, extraStyle])}
      onClick={onClick}
    >
      <TextComponent align={TEXT_ALIGN_ENUM.CENTER}>{label}</TextComponent>
    </button>
  );
};

export default ButtonV3;
