import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  link: {
    fontStyle: 'normal',
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 16,
    fontFamily: FONTS.inter,
    lineHeight: 18,
  },
  primary: {
    color: COLORS.primary,
  },
  secondary: {
    color: COLORS.white,
  },
  monotoneOne: {
    color: COLORS.monotone_1,
  },
});

export default styles;
