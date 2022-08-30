import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#4F3A9C',
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
    fontSize: 16,
    lineHeight: 22,
  }
});

export default styles;
