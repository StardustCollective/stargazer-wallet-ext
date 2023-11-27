import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, FONTS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: NEW_COLORS.gray_300,
  },
  focused: {
    borderColor: NEW_COLORS.primary_lighter_1,
  },
  icon: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    paddingLeft: 4,
    marginLeft: 8,
    color: COLORS.white,
    fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.regular,
  },
});

export default styles;
