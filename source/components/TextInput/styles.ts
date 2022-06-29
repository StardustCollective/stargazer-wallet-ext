import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    color: COLORS.gray_dark,
    fontFamily: FONTS.rubik,
    paddingVertical: 10,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
    borderColor: COLORS.gray_200,
    borderStyle: 'solid',
    marginBottom: -24,
    marginHorizontal: -24,
  },
  fullWidth: {
    paddingHorizontal: 0,
    marginHorizontal: -10, // container has 10 padding to compensate you cant change
  },
  label: {
    paddingBottom: 10,
    fontSize: 12,
    color: COLORS.black,
    lineHeight: 20,
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.medium,
    marginHorizontal: -10, // container has 10 padding to compensate you cant change
  },
});

export default styles;
