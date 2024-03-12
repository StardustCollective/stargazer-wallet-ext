import { StyleSheet } from 'react-native';
import { FONT_WEIGHTS, COLORS, NEW_COLORS } from 'assets/styles/_variables';
import { getDeviceId } from 'react-native-device-info';

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: getDeviceId().includes('iPod') ? 120 : 145,
    paddingHorizontal: 30,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0)',
  },
  containerStyle: {},
  disabled: {
    opacity: 0.5,
  },
  disabledTitle: {
    color: COLORS.white,
  },
  buttonSmall: {
    height: 40,
    borderRadius: 20,
    minWidth: 144,
  },
  buttonMedium: {
    height: 44,
    borderRadius: 20,
    minWidth: 144,
  },
  buttonLarge: {
    height: getDeviceId().includes('iPod') ? 40 : 48,
    borderRadius: 24,
  },
  buttonFullWidth: {
    height: getDeviceId().includes('iPod') ? 40 : 48,
    width: '100%',
    borderRadius: 24,
  },
  titleSmall: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  titleMedium: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 16,
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
  primaryOutline: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: COLORS.primary_lighter_1,
    borderWidth: 1,
  },
  primaryOutlineTitle: {
    color: COLORS.primary_lighter_1,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary_lighter_1,
  },
  accentOneButton: {
    backgroundColor: COLORS.accent_1,
  },
  secondaryOutline: {
    backgroundColor: COLORS.white,
    color: COLORS.gray_dark,
  },
  secondaryOutlineTitle: {
    color: COLORS.primary_lighter_1,
  },
  tertiarySolid: {
    backgroundColor: NEW_COLORS.gray_300,
  },
  graySolid: {
    backgroundColor: NEW_COLORS.gray_500,
  },
  tertiarySolidTitle: {
    color: COLORS.black,
  },
  errorSolid: {
    backgroundColor: NEW_COLORS.red_700,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  newPrimarySolid: {
    backgroundColor: NEW_COLORS.primary,
  },
});

export default styles;
