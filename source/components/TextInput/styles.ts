import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    color: COLORS.gray_dark,
    fontFamily: FONTS.inter,
    paddingVertical: 10,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 16,
    borderColor: NEW_COLORS.gray_300,
    borderStyle: 'solid',
    marginBottom: -24,
    marginHorizontal: -24,
  },
  inputFocused: {
    borderColor: NEW_COLORS.primary_lighter_2,
  },
  inputNotFocused: {
    borderColor: 'red',
  },
  fullWidth: {
    paddingHorizontal: 0,
    marginHorizontal: -10, // container has 10 padding to compensate you cant change
  },
  label: {
    paddingBottom: 8,
    fontSize: 12,
    color: COLORS.black,
    lineHeight: 20,
    fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.medium,
    marginHorizontal: -10, // container has 10 padding to compensate you cant change
  },
  error: {
    borderColor: COLORS.red,
  },
});

export default styles;
