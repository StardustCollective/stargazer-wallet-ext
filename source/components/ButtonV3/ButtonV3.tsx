//////////////////////
// Modules
/////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

//////////////////////
// Components
/////////////////////

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  SECONDARY_SOLID,
  ACCENT_ONE_SOLID,
  MONOTONE_ONE_SOLID,
  PRIMARY_OUTLINE,
  ACCENT_ONE_OUTLINE,
  SECONDARY_OUTLINE,
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
  loading?: boolean;
  label: string;
  extraStyle?: string;
  onClick?: () => void;
  submit?: boolean;
  disabled?: boolean;
}

//////////////////////
// Component
/////////////////////

const ButtonV3: FC<IButtonV3Props> = ({
  id,
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  loading = false,
  label = '',
  extraStyle = '',
  onClick = () => {},
  submit = false,
  disabled = false,
}) => {
  let buttonSizeStyle = '';
  let buttonColorStyle = '';
  let buttonTextColor = null;
  let buttonBorderStyle = '';
  let TextComponent = null;
  let disabledStyles = '';

  if (size === BUTTON_SIZES_ENUM.SMALL) {
    buttonSizeStyle = styles.buttonSmall;
    TextComponent = TextV3.CaptionStrong;
  } else if (size === BUTTON_SIZES_ENUM.LARGE) {
    buttonSizeStyle = styles.buttonLarge;
    TextComponent = TextV3.BodyStrong;
  }

  if (type === BUTTON_TYPES_ENUM.PRIMARY_SOLID) {
    buttonColorStyle = styles.primaryButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.SECONDARY_SOLID) {
    buttonColorStyle = styles.secondaryButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID) {
    buttonColorStyle = styles.accentOneButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  }

  if (disabled) {
    disabledStyles = styles.disabled;
  }

  return (
    <button
      id={id}
      disabled={disabled || loading}
      type={submit ? 'submit' : 'button'}
      className={clsx([styles.base, buttonColorStyle, buttonTextColor, buttonSizeStyle, buttonBorderStyle, extraStyle, disabledStyles])}
      onClick={onClick}
    >
      {!loading ? 
        <TextComponent align={TEXT_ALIGN_ENUM.CENTER}>{label}</TextComponent> : 
        <div className={styles.loader}>
          <CircularProgress size={24}/>
        </div>
      }
      
    </button>
  );
};

export default ButtonV3;
