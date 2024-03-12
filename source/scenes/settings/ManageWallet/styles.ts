import { StyleSheet } from 'react-native';
import { COLORS, FONTS, NEW_COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    padding: 16,
    marginBottom: 24,
    flexGrow: 1,
  },
  label: {
    fontFamily: FONTS.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: NEW_COLORS.secondary_text,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.medium,
  },
  inputContainer: {
    marginHorizontal: -10, // compensate for View container at 10px padding
    marginBottom: -20,
    position: 'relative',
    lineHeight: 24,
    height: 56,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  input: {
    color: NEW_COLORS.secondary_text,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.regular,
    textAlign: 'right',
  },
  menuContainer: {
    marginTop: 20,
  },
  addressesContainer: {
    marginTop: 12,
  },
  removeWalletContainer: {
    marginTop: -8,
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
  copiedLabel: {
    color: NEW_COLORS.primary_lighter_1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '50%',
  },
  cancel: {
    marginRight: 6,
  },
  save: {
    marginLeft: 6,
  },
  removeText: {
    color: NEW_COLORS.red_700,
  },
  titleAddress: {
    fontWeight: FONT_WEIGHTS.regular,
    color: NEW_COLORS.secondary_text,
  },
});

export default styles;
