import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  toast: {
    backgroundColor: COLORS.purple,
    width: 365,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toastText: {
    color: COLORS.white,
    // fontFamily: FONTS.inter,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.35,
    padding: 12,
    textAlign: 'center',
  },
  toastError: {
    backgroundColor: COLORS.red_100,
  },
  toastIcon: {
    marginRight: 12,
    width: 18,
    height: 18,
  },
  alert: {
    zIndex: 9999,
  },
});

export default styles;
