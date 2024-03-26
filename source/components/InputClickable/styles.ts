import { StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    paddingBottom: 10,
    fontSize: 12,
    color: COLORS.black,
    lineHeight: 20,
    fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.medium,
  },
  labelRight: {
    color: 'rgba(0, 0, 0, 0.66)',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default styles;
