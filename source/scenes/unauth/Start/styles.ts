import { StyleSheet } from 'react-native';
import { COLORS, FONT_WEIGHTS } from 'assets/styles/_variables';
import { getDeviceId } from 'react-native-device-info';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: 48,
    marginBottom: 56,
    width: 192,
    height: 166,
  },
  restoreButton: {
    width: 264,
    borderWidth: 2,
    marginTop: 16,
  },
  restoreButtonText: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
  },
  createWalletButton: {
    width: 264,
  },
  createWalletButtonText: {
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default styles;
