import React from 'react';
import clsx from 'clsx';
import DynamicFont from 'react-dynamic-font';

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
// Types
/////////////////////

type ITextProps = {
  children?: React.ReactNode;
  dynamic?: boolean;
  textStyle?: string;
  extraStyles?: string;
  color?: COLORS_ENUMS;
  align?: TEXT_ALIGN_ENUM;
};

//////////////////////
// Components
/////////////////////

/*
 * Dynamic Font Resizing
 * Note: For the Dynamic font sized to work properly a `max-width`,
 * and `overflow: hidden` must be assigned to the Text via
 * the extraStyles prop.
 */

const TextV3 = {
  base: ({
    children,
    dynamic = false,
    color = COLORS_ENUMS.WHITE,
    align = TEXT_ALIGN_ENUM.LEFT,
    textStyle = '',
    extraStyles = '',
  }: ITextProps) => {
    let colorStyle = '';
    let alignStyle = '';

    // Colors
    if (color === COLORS_ENUMS.BLACK) {
      colorStyle = styles.textBlack;
    } else if (color === COLORS_ENUMS.WHITE) {
      colorStyle = styles.textWhite;
    } else if (color === COLORS_ENUMS.GRAY_100) {
      colorStyle = styles.textGray100;
    } else if (color === COLORS_ENUMS.DARK_GRAY_200) {
      colorStyle = styles.textDarkGray200;
    } else if (color === COLORS_ENUMS.PRIMARY) {
      colorStyle = styles.textPrimary;
    } else if (color === COLORS_ENUMS.PRIMARY_LIGHTER_1) {
      colorStyle = styles.textPrimaryLighter1;
    } else if (color === COLORS_ENUMS.RED) {
      colorStyle = styles.textRed;
    } else if (color === COLORS_ENUMS.PURPLE_DARK) {
      colorStyle = styles.textPurpleDark;
    } else if (color === COLORS_ENUMS.LINK_BLUE) {
      colorStyle = styles.textLinkBlue;
    } else if (color === COLORS_ENUMS.SECONDARY_TEXT) {
      colorStyle = styles.textSecondary;
    }

    //Alignment
    if (align === TEXT_ALIGN_ENUM.LEFT) {
      alignStyle = 't-alignLeft';
    } else if (align === TEXT_ALIGN_ENUM.CENTER) {
      alignStyle = 't-alignCenter';
    } else if (align === TEXT_ALIGN_ENUM.RIGHT) {
      alignStyle = 't-alignRight';
    }

    const ParentComponent = dynamic ? 'div' : 'span';

    return (
      <ParentComponent
        className={clsx([styles.base, colorStyle, alignStyle, textStyle, extraStyles])}
      >
        {dynamic ? <DynamicFont content={children as string} /> : [children]}
      </ParentComponent>
    );
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
    );
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
    );
  },
  HeaderLargeRegular: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.headerLargeRegular}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    );
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
    );
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
    );
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
    );
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
    );
  },
  CaptionRegular: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.captionRegular}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    );
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
    );
  },
  LabelSemiStrong: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.labelSemiStrong}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    );
  },
  Label: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.label}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    );
  },
  Description: ({ children, dynamic, color, align, extraStyles }: ITextProps) => {
    return (
      <TextV3.base
        dynamic={dynamic}
        color={color}
        textStyle={styles.description}
        align={align}
        extraStyles={extraStyles}
      >
        {children}
      </TextV3.base>
    );
  },
};

export default TextV3;
