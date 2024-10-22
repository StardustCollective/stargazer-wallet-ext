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

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './ButtonV3.scss';

//////////////////////
// Enums
/////////////////////

export enum BUTTON_TYPES_ENUM {
  PRIMARY_SOLID = 0,
  SECONDARY_SOLID,
  ACCENT_ONE_SOLID,
  MONOTONE_ONE_SOLID,
  PRIMARY_OUTLINE,
  ACCENT_ONE_OUTLINE,
  SECONDARY_OUTLINE,
  TERTIARY_SOLID,
  NEW_PRIMARY_SOLID,
  ERROR_SOLID,
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
  loading?: boolean;
  loadingColor?: 'inherit' | 'primary' | 'secondary';
  loadingSize?: number;
  label: string;
  extraStyle?: string;
  extraTitleStyles?: string;
  extraLoaderStyle?: string;
  onClick?: (ev: any) => void;
  submit?: boolean;
  disabled?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

//////////////////////
// Component
/////////////////////

const ButtonV3: FC<IButtonV3Props> = ({
  id,
  type = BUTTON_TYPES_ENUM.PRIMARY_SOLID,
  size = BUTTON_SIZES_ENUM.SMALL,
  loading = false,
  loadingColor = 'inherit',
  loadingSize = 24,
  label = '',
  extraStyle = '',
  extraTitleStyles = '',
  extraLoaderStyle = '',
  onClick = () => {},
  submit = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
}) => {
  let buttonSizeStyle = '';
  let buttonColorStyle = '';
  let buttonTextColor = null;
  let TextComponent = null;
  let disabledStyles = '';

  if (size === BUTTON_SIZES_ENUM.SMALL) {
    buttonSizeStyle = styles.buttonSmall;
    TextComponent = TextV3.CaptionStrong;
  } else if (size === BUTTON_SIZES_ENUM.MEDIUM) {
    buttonSizeStyle = styles.buttonMedium;
    TextComponent = TextV3.CaptionStrong;
  } else if (size === BUTTON_SIZES_ENUM.LARGE) {
    buttonSizeStyle = styles.buttonLarge;
    TextComponent = TextV3.LabelSemiStrong;
  } else if (size === BUTTON_SIZES_ENUM.FULL_WIDTH) {
    buttonSizeStyle = styles.buttonFillWidth;
    TextComponent = TextV3.BodyStrong;
  }

  if (type === BUTTON_TYPES_ENUM.PRIMARY_SOLID) {
    buttonColorStyle = styles.primaryButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.PRIMARY_OUTLINE) {
    buttonColorStyle = styles.primaryOutlineButton;
    buttonTextColor = COLORS_ENUMS.PRIMARY_LIGHTER_1;
  } else if (type === BUTTON_TYPES_ENUM.SECONDARY_SOLID) {
    buttonColorStyle = styles.secondaryButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.SECONDARY_OUTLINE) {
    buttonColorStyle = styles.secondaryOutlineButton;
    buttonTextColor = COLORS_ENUMS.PRIMARY_LIGHTER_1;
  } else if (type === BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID) {
    buttonColorStyle = styles.accentOneButton;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.TERTIARY_SOLID) {
    buttonColorStyle = styles.tertiarySolid;
    buttonTextColor = COLORS_ENUMS.BLACK;
  } else if (type === BUTTON_TYPES_ENUM.GRAY_SOLID) {
    buttonColorStyle = styles.graySolid;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID) {
    buttonColorStyle = styles.newPrimarySolid;
    buttonTextColor = COLORS_ENUMS.WHITE;
  } else if (type === BUTTON_TYPES_ENUM.ERROR_SOLID) {
    buttonColorStyle = styles.errorSolid;
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
      className={clsx([
        styles.base,
        buttonColorStyle,
        buttonTextColor,
        buttonSizeStyle,
        extraStyle,
        disabledStyles,
      ])}
      onClick={onClick}
    >
      {!loading ? (
        <div className={styles.textContainer}>
          {!!leftIcon && <div className={styles.iconLeft}>{leftIcon}</div>}
          <TextComponent
            color={buttonTextColor}
            extraStyles={extraTitleStyles}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {label}
          </TextComponent>
          {!!rightIcon && <div className={styles.iconRight}>{rightIcon}</div>}
        </div>
      ) : (
        <div className={clsx([styles.loader, extraLoaderStyle])}>
          <CircularProgress size={loadingSize} color={loadingColor} />
        </div>
      )}
    </button>
  );
};

export default ButtonV3;
