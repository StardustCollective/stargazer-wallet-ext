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

const COLOR_STYLES: { [value: number]: string } = {
  [COLORS_ENUMS.BLACK]: styles.textBlack,
  [COLORS_ENUMS.WHITE]: styles.textWhite,
  [COLORS_ENUMS.GRAY_100]: styles.textGray100,
  [COLORS_ENUMS.DARK_GRAY_200]: styles.textDarkGray200,
  [COLORS_ENUMS.PRIMARY]: styles.textPrimary,
  [COLORS_ENUMS.DARK_GRAY]: styles.textGrayDark,
  [COLORS_ENUMS.PRIMARY_LIGHTER_1]: styles.textPrimaryLighter1,
  [COLORS_ENUMS.RED]: styles.textRed,
  [COLORS_ENUMS.PURPLE_DARK]: styles.textPurpleDark,
  [COLORS_ENUMS.LINK_BLUE]: styles.textLinkBlue,
  [COLORS_ENUMS.SECONDARY_TEXT]: styles.textSecondary,
};

const ALIGN_STYLES: { [value: number]: string } = {
  [TEXT_ALIGN_ENUM.LEFT]: 't-alignLeft',
  [TEXT_ALIGN_ENUM.CENTER]: 't-alignCenter',
  [TEXT_ALIGN_ENUM.RIGHT]: 't-alignRight',
};

const TextV3 = {
  base: ({
    children,
    dynamic = false,
    color = COLORS_ENUMS.WHITE,
    align = TEXT_ALIGN_ENUM.LEFT,
    textStyle = '',
    extraStyles = '',
  }: ITextProps) => {
    const colorStyle = COLOR_STYLES[color];
    const alignStyle = ALIGN_STYLES[align];

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
