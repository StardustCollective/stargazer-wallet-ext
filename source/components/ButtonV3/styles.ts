import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    paddingHorizontal: 30,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0)',
  },
  containerStyle: {},
  buttonSmall: {
    height: 32,
    borderRadius: 20,
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
});

export default styles;
