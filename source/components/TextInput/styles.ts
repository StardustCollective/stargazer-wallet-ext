import { StyleSheet } from 'react-native';
import { FONTS, FONT_WEIGHTS, COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
    borderColor: COLORS.grey_100,
    marginBottom: -15
  },
  label: {
    paddingLeft: 14,
    paddingBottom: 10,
    fontSize: 12,
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.medium,
  }
});

export default styles;
