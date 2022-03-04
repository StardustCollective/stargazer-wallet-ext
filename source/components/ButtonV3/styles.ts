import { StyleSheet } from 'react-native';
import { FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 145,
    paddingHorizontal: 30,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0)',
  },
  containerStyle: {},
  buttonSmall: {
    height: 40,
    borderRadius: 20,
    minWidth: 144,
  },
  buttonLarge: {
    height: 48,
    borderRadius: 24,
  },
  titleSmall: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  titleLarge: {
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: 18,
    color: COLORS.white,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  accentOneButton: {
    backgroundColor: COLORS.accent_1,
  },
  secondaryOutline: {
    backgroundColor: COLORS.white,
    color: COLORS.gray_dark,
  },
  secondaryOutlineTitle: {
    color: COLORS.primary,
  },
});

export default styles;
