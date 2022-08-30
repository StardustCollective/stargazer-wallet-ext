import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOWS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  button: {
    width: 200,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 50,
    padding: 8,
  },
  buttonTitle: {
    fontFamily: FONTS.inter,
    fontSize: 20,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  primary_title: {
    color: COLORS.white,
  },
  secondary: {
    backgroundColor: COLORS.primary_lighter_2,
  },
  secondary_title: {
    color: COLORS.purple,
  },
  disabled: {
    backgroundColor: COLORS.gray_light,
  },
  disabledTitle: {
    color: COLORS.grey_100,
  },
});

export default styles;
