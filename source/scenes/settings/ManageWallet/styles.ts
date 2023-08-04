import { StyleSheet } from 'react-native';
import { COLORS, FONTS, NEW_COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'scroll',
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  label: {
    fontFamily: FONTS.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: NEW_COLORS.secondary_text,
    marginBottom: 8,
    marginTop: 24,
  },
  inputContainer: {
    marginHorizontal: -10, // compensate for View container at 10px padding
    marginBottom: -20,
    position: 'relative',
    lineHeight: 24,
    height: 50,
    paddingHorizontal: 16,
  },
  menuContainer: {
    marginTop: 20,
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  cancel: {
    backgroundColor: NEW_COLORS.gray_300,
  },
  buttonCancelText: {
    color: COLORS.black,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 6,
    width: 170,
    backgroundColor: NEW_COLORS.primary,
  },
  removeText: {
    color: COLORS.red,
  },
  titleAddress: {
    fontWeight: FONT_WEIGHTS.regular,
    color: NEW_COLORS.secondary_text,
  },
});

export default styles;
