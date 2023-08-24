import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  base: {
    fontFamily: FONTS.inter,
    overflow: 'hidden',
  },
  headerDisplay: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 40,
    lineHeight: 48,
  },
  headerLarge: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 32,
    lineHeight: 40,
  },
  headerLargeRegular: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 32,
    lineHeight: 40,
  },
  header: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 24,
    lineHeight: 32,
  },
  body: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyStrong: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  labelSemiStrong: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 16,
    lineHeight: 20,
  },
  caption: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 12,
    lineHeight: 20,
  },
  captionRegular: {
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  captionStrong: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  primary: {
    color: COLORS.primary,
  },
  whiteFont: {
    color: COLORS.white,
  },
  blackFont: {
    color: COLORS.black,
  },
  redFont: {
    color: COLORS.red,
  },
  grayDarkFont: {
    color: COLORS.grey_dark,
  },
  greyDark200Font: {
    color: COLORS.gray_dark_200,
  },
  gray100Font: {
    color: COLORS.gray_100,
  },
  purpleDarkFont: {
    color: COLORS.purple_dark,
  },
  linkBlueFont: {
    color: COLORS.link_blue,
  },
  secondaryTextFont: {
    color: NEW_COLORS.secondary_text,
  },
  primaryLighter1: {
    color: NEW_COLORS.primary_lighter_1,
  },
  label: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 10,
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 16,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
});

export default styles;

/*
 * Text Alignment
 */

// .alignLeft {
//   text-align: left;
// }

// .alignCenter {
//   text-align: center;
// }

// .alignRight {
//   text-align: right;
// }
